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

const calculateSplitParams = (imageWidth: number, imageHeight: number, config: SplitConfig) => {
  const { mode, rows, cols } = config

  switch (mode) {
    case 'vertical':
      return {
        splitCount: cols,
        splitWidth: imageWidth / cols,
        splitHeight: imageHeight
      }
    case 'horizontal':
      return {
        splitCount: rows,
        splitWidth: imageWidth,
        splitHeight: imageHeight / rows
      }
    case 'grid':
    default:
      return {
        splitCount: rows * cols,
        splitWidth: imageWidth / cols,
        splitHeight: imageHeight / rows
      }
  }
}

const calculateSplitPosition = (
  index: number,
  config: SplitConfig,
  splitWidth: number,
  splitHeight: number
) => {
  const { mode, cols } = config

  if (mode === 'vertical') {
    return { sx: (index % cols) * splitWidth, sy: 0 }
  }

  if (mode === 'horizontal') {
    return { sx: 0, sy: index * splitHeight }
  }

  return {
    sx: (index % cols) * splitWidth,
    sy: Math.floor(index / cols) * splitHeight
  }
}

const toUintDimension = (value: number) => {
  const rounded = Math.max(1, Math.floor(value))
  return rounded
}

const JPEG_QUALITY = 0.85

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
  const { splitCount, splitWidth, splitHeight } = calculateSplitParams(
    bitmap.width,
    bitmap.height,
    config
  )

  const splitPromises: Array<Promise<SplitSuccessMessage['splits'][number]>> = []
  const startIndex = range ? range.start : 0
  const endIndex = range ? range.end : splitCount

  for (let index = startIndex; index < endIndex; index++) {
    const { sx, sy } = calculateSplitPosition(index, config, splitWidth, splitHeight)
    const width = toUintDimension(splitWidth)
    const height = toUintDimension(splitHeight)

    const canvas = new OffscreenCanvas(width, height)
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('无法创建 OffscreenCanvas 上下文')
    }

    context.drawImage(
      bitmap,
      sx,
      sy,
      splitWidth,
      splitHeight,
      0,
      0,
      width,
      height
    )

    let blobType = `image/${config.outputFormat}`
    let quality: number | undefined
    if (config.outputFormat === 'jpg') {
      blobType = 'image/jpeg'
      quality = JPEG_QUALITY
    } else if (config.outputFormat === 'webp') {
      quality = JPEG_QUALITY
    }

    const blobPromise = canvas
      .convertToBlob(quality !== undefined ? { type: blobType, quality } : { type: blobType })
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
