/// <reference lib="webworker" />

import type { OutputFormat, SplitConfig } from '@/types'

type SplitRequestMessage = {
  type: 'split'
  requestId: string
  blob: Blob
  config: SplitConfig
}

type SplitSuccessMessage = {
  type: 'split-result'
  requestId: string
  format: OutputFormat
  splits: Array<{
    index: number
    width: number
    height: number
    blob: Blob
  }>
}

type SplitErrorMessage = {
  type: 'split-error'
  requestId: string
  error: string
}

type SplitChunkMessage = SplitRequestMessage & {
  range?: { start: number; end: number }
}

type WorkerMessage = SplitChunkMessage

const ctx = self as DedicatedWorkerGlobalScope

const workerLog = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'development') {
    return
  }
  // eslint-disable-next-line no-console
  console.log('[ImageSplitterWorker]', ...args)
}

const getEffectiveDimensions = (
  imageWidth: number,
  imageHeight: number,
  cropRegion: SplitConfig['cropRegion']
) => {
  if (!cropRegion) {
    return {
      width: imageWidth,
      height: imageHeight,
      offsetX: 0,
      offsetY: 0
    }
  }

  return {
    width: cropRegion.width,
    height: cropRegion.height,
    offsetX: cropRegion.x,
    offsetY: cropRegion.y
  }
}

type GridShape = {
  rowCount: number
  colCount: number
}

type AxisSegment = {
  sourceStart: number
  sourceSize: number
  outputSize: number
}

const getGridShape = (config: SplitConfig): GridShape => {
  switch (config.mode) {
    case 'vertical':
      return { rowCount: 1, colCount: config.cols }
    case 'horizontal':
      return { rowCount: config.rows, colCount: 1 }
    case 'grid':
    default:
      return { rowCount: config.rows, colCount: config.cols }
  }
}

const createAxisSegments = (length: number, count: number): AxisSegment[] => {
  const safeCount = Math.max(1, Math.floor(count))
  const sourceLength = Math.max(1, length)
  const outputLength = Math.max(safeCount, Math.round(sourceLength))
  const segments: AxisSegment[] = []

  let previousOutputEnd = 0

  for (let index = 0; index < safeCount; index++) {
    const sourceStart = (sourceLength * index) / safeCount
    const sourceEnd = (sourceLength * (index + 1)) / safeCount
    const outputEnd = Math.round((outputLength * (index + 1)) / safeCount)

    segments.push({
      sourceStart,
      sourceSize: sourceEnd - sourceStart,
      outputSize: Math.max(1, outputEnd - previousOutputEnd)
    })

    previousOutputEnd = outputEnd
  }

  return segments
}

const getSliceIndices = (index: number, config: SplitConfig, colCount: number) => {
  if (config.mode === 'vertical') {
    return { rowIndex: 0, colIndex: index }
  }

  if (config.mode === 'horizontal') {
    return { rowIndex: index, colIndex: 0 }
  }

  return {
    rowIndex: Math.floor(index / colCount),
    colIndex: index % colCount
  }
}

const calculateSplitParams = (imageWidth: number, imageHeight: number, config: SplitConfig) => {
  const { rowCount, colCount } = getGridShape(config)
  const { width, height, offsetX, offsetY } = getEffectiveDimensions(
    imageWidth,
    imageHeight,
    config.cropRegion
  )

  return {
    splitCount: rowCount * colCount,
    rowCount,
    colCount,
    width,
    height,
    offsetX,
    offsetY
  }
}

const JPEG_QUALITY = 0.85
const OUTPUT_FORMAT_EXPORT_OPTIONS: Record<OutputFormat, { type: string; quality?: number }> = {
  jpg: { type: 'image/jpeg', quality: JPEG_QUALITY },
  png: { type: 'image/png' },
  webp: { type: 'image/webp', quality: JPEG_QUALITY }
}

const splitBitmap = async (
  bitmap: ImageBitmap,
  config: SplitConfig,
  range?: { start: number; end: number }
) => {
  workerLog('splitBitmap start', {
    width: bitmap.width,
    height: bitmap.height,
    config
  })
  const { splitCount, rowCount, colCount, width, height, offsetX, offsetY } = calculateSplitParams(
    bitmap.width,
    bitmap.height,
    config
  )
  const xSegments = createAxisSegments(width, colCount)
  const ySegments = createAxisSegments(height, rowCount)

  const splitPromises: Array<Promise<SplitSuccessMessage['splits'][number]>> = []
  const startIndex = range ? range.start : 0
  const endIndex = range ? range.end : splitCount

  for (let index = startIndex; index < endIndex; index++) {
    const { rowIndex, colIndex } = getSliceIndices(index, config, colCount)
    const xSegment = xSegments[colIndex]
    const ySegment = ySegments[rowIndex]

    if (!xSegment || !ySegment) {
      throw new Error('无法计算切片分段')
    }

    const width = xSegment.outputSize
    const height = ySegment.outputSize

    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('无法创建 OffscreenCanvas 上下文')
    }

    context.drawImage(
      bitmap,
      offsetX + xSegment.sourceStart,
      offsetY + ySegment.sourceStart,
      xSegment.sourceSize,
      ySegment.sourceSize,
      0,
      0,
      width,
      height
    )

    const exportOptions = OUTPUT_FORMAT_EXPORT_OPTIONS[config.outputFormat]

    const blobPromise = canvas
      .convertToBlob(exportOptions)
      .then((blob) => {
        if (!blob) {
          throw new Error('Failed to generate blob')
        }
        return {
          index,
          width,
          height,
          blob
        }
      })

    splitPromises.push(blobPromise)
  }

  const splits = await Promise.all(splitPromises)
  workerLog('splitBitmap finished', { slices: splits.length })
  return {
    format: config.outputFormat,
    splits
  }
}

ctx.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const message = event.data

  if (!message || message.type !== 'split') {
    return
  }

  const { requestId, blob, config } = message

  try {
    workerLog('Received split request', {
      requestId,
      size: blob.size,
      range: message.range
    })
    const bitmap = await createImageBitmap(blob)
    try {
      const result = await splitBitmap(bitmap, config, message.range)
      bitmap.close()

      const response: SplitSuccessMessage = {
        type: 'split-result',
        requestId,
        format: result.format,
        splits: result.splits
      }

      ctx.postMessage(response)
      workerLog('Posted split response', { requestId, slices: result.splits.length })
    } catch (error) {
      bitmap.close()
      throw error
    }
  } catch (error) {
    const response: SplitErrorMessage = {
      type: 'split-error',
      requestId,
      error: error instanceof Error ? error.message : 'Worker split failed'
    }

    ctx.postMessage(response)
    workerLog('Split request failed', { requestId, error })
  }
}

export {}
