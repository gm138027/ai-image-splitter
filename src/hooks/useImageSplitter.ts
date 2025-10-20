import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import type { SplitImage, SplitConfig, ImageSplitterState } from '@/types'
import {
  createImageFromFile,
  splitImage as splitImageUtil,
  downloadSingleImage,
  downloadAllImages,
  calculateSplitParams
} from '@/utils/imageProcessing'

const debugLog = (...args: unknown[]) => {
  if (
    (typeof window !== 'undefined' && (window as any).__AI_IMAGE_SPLITTER_DEBUG === false) ||
    (typeof window === 'undefined' && process.env.NODE_ENV !== 'development')
  ) {
    return
  }

  if (typeof window === 'undefined') {
    console.log('[ImageSplitter]', ...args)
  } else {
    const globalFlag = (window as any).__AI_IMAGE_SPLITTER_DEBUG
    if (globalFlag !== false) {
      console.log('[ImageSplitter]', ...args)
    }
  }
}

const MAX_PARALLEL_WORKERS = 4

type WorkerSplitChunk = {
  index: number
  width: number
  height: number
  blob: Blob
}

type WorkerSplitResult = {
  format: SplitConfig['outputFormat']
  splits: WorkerSplitChunk[]
}

/* eslint-disable no-unused-vars */
interface PendingRequestHandlers {
  resolve(result: WorkerSplitResult): void
  reject(reason?: unknown): void
}
/* eslint-enable no-unused-vars */

type WorkerResponseMessage =
  | {
      type: 'split-result'
      requestId: string
      format: SplitConfig['outputFormat']
      splits: WorkerSplitChunk[]
    }
  | {
      type: 'split-error'
      requestId: string
      error: string
    }

const createRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `split-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const detectWorkerSupport = () => {
  if (typeof window === 'undefined') {
    debugLog('Worker support check skipped (server-side)')
    return false
  }

  const hasWorker = 'Worker' in window
  const hasBitmap = typeof window.createImageBitmap === 'function'
  const hasOffscreen = typeof (window as any).OffscreenCanvas !== 'undefined'

  debugLog('Worker capability check', { hasWorker, hasBitmap, hasOffscreen })
  return hasWorker && hasBitmap && hasOffscreen
}

/**
 * 图像分割功能的自定义Hook
 */
export const useImageSplitter = () => {
  const { t } = useTranslation('common')

  const defaultConfig: SplitConfig = {
    mode: 'grid',
    rows: 3,
    cols: 3,
    gridLineWidth: 2,
    outputFormat: 'jpg'
  }

const releaseSplitImages = useCallback((images: SplitImage[]) => {
  images.forEach((image) => {
    URL.revokeObjectURL(image.objectUrl)
  })
}, [])

const preloadSplitImages = async (images: SplitImage[]) => {
  if (images.length === 0) return

  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          const loader = new Image()
          loader.onload = () => resolve()
          loader.onerror = () => resolve()
          loader.src = image.objectUrl
        })
    )
  )
}

  const releaseUploadedImage = useCallback(() => {
    if (uploadedImageObjectUrlRef.current) {
      URL.revokeObjectURL(uploadedImageObjectUrlRef.current)
      uploadedImageObjectUrlRef.current = null
    }
  }, [])

  const [state, setState] = useState<ImageSplitterState>({
    uploadedImage: null,
    splitImages: [],
    isProcessing: false,
    config: defaultConfig
  })

  // Worker related refs
  const workerSupportedRef = useRef<boolean>(detectWorkerSupport())
  const workerRef = useRef<Worker | null>(null)
  // eslint-disable-next-line no-unused-vars
  const pendingRequestsRef = useRef<Map<string, PendingRequestHandlers>>(new Map())

  // Refs for UI usage
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasEverSplitRef = useRef(false)
  const uploadedFileRef = useRef<File | null>(null)
  const uploadedImageObjectUrlRef = useRef<string | null>(null)
  const splitImagesRef = useRef<SplitImage[]>([])
  const lastAutoSplitParamsRef = useRef<{
    mode: SplitConfig['mode']
    rows: number
    cols: number
    outputFormat: SplitConfig['outputFormat']
  } | null>(null)

  const disposeWorker = useCallback(() => {
    if (workerRef.current) {
      debugLog('Disposing worker instance')
      workerRef.current.terminate()
      workerRef.current = null
    }
  }, [])

  const rejectAllPending = useCallback((reason: unknown) => {
    pendingRequestsRef.current.forEach(({ reject }) => reject(reason))
    pendingRequestsRef.current.clear()
  }, [])

  const handleWorkerMessage = useCallback((event: MessageEvent<WorkerResponseMessage>) => {
    const message = event.data
    if (!message || typeof message !== 'object') {
      return
    }

    const { requestId } = message
    if (!requestId) {
      return
    }

    const pending = pendingRequestsRef.current.get(requestId)
    if (!pending) {
      debugLog('Worker response without pending request', { requestId })
      return
    }

    pendingRequestsRef.current.delete(requestId)

    if (message.type === 'split-result') {
      debugLog('Worker split result received', {
        requestId,
        splits: message.splits.length
      })
      pending.resolve({ format: message.format, splits: message.splits })
    } else {
      debugLog('Worker split error received', {
        requestId,
        error: message.error
      })
      pending.reject(new Error(message.error || 'Worker split failed'))
    }
  }, [])

  const handleWorkerError = useCallback(
    (event: ErrorEvent | MessageEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Image split worker error:', event)
      }
      workerSupportedRef.current = false
      debugLog('Worker runtime error, switching to fallback', event)
      rejectAllPending(new Error('Worker execution failed'))
      disposeWorker()
    },
    [disposeWorker, rejectAllPending]
  )

  const ensureWorker = useCallback(() => {
    if (!workerSupportedRef.current) {
      debugLog('Worker requested but support flag is false')
      return null
    }

    if (workerRef.current) {
      debugLog('Reusing existing worker instance')
      return workerRef.current
    }

    try {
      const worker = new Worker(
        new URL('../workers/imageSplitter.worker.ts', import.meta.url),
        { type: 'module' }
      )
      worker.onmessage = handleWorkerMessage
      worker.onerror = handleWorkerError
      worker.onmessageerror = handleWorkerError as any
      workerRef.current = worker
      debugLog('Worker initialised successfully')
      return worker
    } catch (error) {
      workerSupportedRef.current = false
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to initialise image split worker:', error)
      }
      debugLog('Worker initialisation failed', error)
      return null
    }
  }, [handleWorkerError, handleWorkerMessage])

  useEffect(() => {
    const previous = splitImagesRef.current
    if (previous !== state.splitImages) {
      if (previous.length > 0) {
        releaseSplitImages(previous)
      }
      splitImagesRef.current = state.splitImages
    }
  }, [releaseSplitImages, state.splitImages])

  useEffect(() => {
    return () => {
      debugLog('Cleaning up worker on unmount')
      disposeWorker()
      rejectAllPending(new Error('Worker disposed'))
      releaseSplitImages(splitImagesRef.current)
      releaseUploadedImage()
    }
  }, [disposeWorker, rejectAllPending, releaseSplitImages, releaseUploadedImage])

  const buildSplitImagesFromWorker = useCallback(
    (result: WorkerSplitResult): SplitImage[] => {
      const { splits } = result
      const sortedSplits = [...splits].sort((a, b) => a.index - b.index)

      return sortedSplits.map((split) => {
        const blob = split.blob
        const objectUrl = URL.createObjectURL(blob)
        return {
          id: `split-${split.index}`,
          blob,
          objectUrl,
          width: split.width,
          height: split.height
        }
      })
    },
    []
  )

  const splitWithWorker = useCallback(
    async (sourceFile: Blob, width: number, height: number, config: SplitConfig): Promise<SplitImage[]> => {
      const worker = ensureWorker()
      if (!worker) {
        debugLog('Worker unavailable, will rely on fallback')
        throw new Error('Worker not available')
      }

      const requestId = createRequestId()
      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
      debugLog('Worker split dispatched', {
        requestId,
        width,
        height,
        config
      })

      const resultPromise = new Promise<WorkerSplitResult>((resolve, reject) => {
        pendingRequestsRef.current.set(requestId, { resolve, reject })
      })

      try {
        worker.postMessage({
          type: 'split',
          requestId,
          blob: sourceFile,
          config
        })
      } catch (error) {
        pendingRequestsRef.current.delete(requestId)
        debugLog('Worker postMessage failed', error)
        throw error
      }

      const result = await resultPromise
      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
      debugLog('Worker split finished', {
        requestId,
        duration: endTime - startTime,
        splits: result.splits.length
      })
      return buildSplitImagesFromWorker(result)
    },
    [buildSplitImagesFromWorker, ensureWorker]
  )

  const splitWithWorkerPool = useCallback(
    async (
      sourceFile: File,
      image: HTMLImageElement,
      config: SplitConfig,
      workerCount: number
    ): Promise<SplitImage[]> => {
      const { splitCount } = calculateSplitParams(image, config)
      const slicesPerWorker = Math.ceil(splitCount / workerCount)
      const workerTasks: Array<Promise<WorkerSplitResult>> = []

      for (let i = 0; i < workerCount; i++) {
        const start = i * slicesPerWorker
        const end = Math.min(start + slicesPerWorker, splitCount)
        if (start >= end) {
          break
        }

        workerTasks.push(
          new Promise<WorkerSplitResult>((resolve, reject) => {
            const requestId = createRequestId()
            const worker = new Worker(
              new URL('../workers/imageSplitter.worker.ts', import.meta.url),
              { type: 'module' }
            )

            worker.onmessage = (event: MessageEvent<WorkerResponseMessage>) => {
              const message = event.data
              if (message.requestId !== requestId) {
                return
              }
              worker.terminate()
              if (message.type === 'split-result') {
                resolve({
                  format: message.format,
                  splits: message.splits
                })
              } else {
                reject(new Error(message.error || 'Worker split failed'))
              }
            }

            worker.onerror = (event) => {
              worker.terminate()
              debugLog('Parallel worker error', event)
              reject(event.error || new Error('Worker error'))
            }

            worker.postMessage({
              type: 'split',
              requestId,
              blob: sourceFile,
              config,
              range: { start, end }
            })
          })
        )
      }

      const chunkResults = await Promise.all(workerTasks)
      const merged = chunkResults.flatMap(buildSplitImagesFromWorker)
      return merged.sort((a, b) => {
        const indexA = parseInt(a.id.split('-')[1] || '0', 10)
        const indexB = parseInt(b.id.split('-')[1] || '0', 10)
        return indexA - indexB
      })
    },
    [buildSplitImagesFromWorker]
  )

  const generateSplitImages = useCallback(
    async (image: HTMLImageElement, config: SplitConfig): Promise<SplitImage[]> => {
      let result: SplitImage[]

      const { splitCount } = calculateSplitParams(image, config)
      const hardwareLimit =
        typeof navigator !== 'undefined' && navigator.hardwareConcurrency
          ? navigator.hardwareConcurrency
          : 1
      const desiredWorkers = Math.min(MAX_PARALLEL_WORKERS, hardwareLimit, splitCount)
      const shouldUsePool =
        workerSupportedRef.current &&
        uploadedFileRef.current &&
        desiredWorkers > 1 &&
        splitCount >= 16

      if (shouldUsePool) {
        try {
          debugLog('Using parallel worker pool', { desiredWorkers, splitCount })
          result = await splitWithWorkerPool(uploadedFileRef.current!, image, config, desiredWorkers)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Worker pool failed, falling back to single worker:', error)
          }
          debugLog('Worker pool failed, retrying with single worker', error)
          result = await splitWithWorker(uploadedFileRef.current!, image.width, image.height, config)
        }
      } else if (workerSupportedRef.current && uploadedFileRef.current) {
        try {
          result = await splitWithWorker(uploadedFileRef.current, image.width, image.height, config)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Worker split failed, falling back to main thread:', error)
          }
          workerSupportedRef.current = false
          disposeWorker()
          rejectAllPending(error)
          debugLog('Worker split failed, fallback engaged', error)
          result = await splitImageUtil(image, config)
        }
      } else {
        debugLog('Executing split on main thread')
        result = await splitImageUtil(image, config)
      }

      await preloadSplitImages(result)
      return result
    },
    [disposeWorker, rejectAllPending, splitWithWorker, splitWithWorkerPool]
  )

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const { image: img, objectUrl } = await createImageFromFile(file)
        hasEverSplitRef.current = false
        setState((prev) => ({
          ...prev,
          uploadedImage: img,
          splitImages: []
        }))
        releaseUploadedImage()
        uploadedImageObjectUrlRef.current = objectUrl
        uploadedFileRef.current = file
        debugLog('Image uploaded', {
          name: file.name,
          width: img.width,
          height: img.height,
          size: file.size
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'invalidFile'
        switch (errorMessage) {
          case 'invalidFileType':
            alert(t('tool.alerts.invalidFileType'))
            break
          case 'fileTooLarge':
            alert(t('tool.alerts.fileTooLarge'))
            break
          case 'imageTooLarge':
            alert(t('tool.alerts.imageTooLarge'))
            break
          default:
            alert(t('tool.alerts.invalidFile'))
        }
        releaseUploadedImage()
        debugLog('Image upload failed', { error })
      }
    },
    [releaseUploadedImage, t]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload]
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        setState((prev) => ({
          ...prev,
          splitImages: []
        }))
        debugLog('File input changed', { count: files.length })
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload]
  )

  const updateConfig = useCallback((newConfig: Partial<SplitConfig>) => {
    setState((prev) => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }))
  }, [])

  useEffect(() => {
    const currentParams = {
      mode: state.config.mode,
      rows: state.config.rows,
      cols: state.config.cols,
      outputFormat: state.config.outputFormat
    }
    const previousParams = lastAutoSplitParamsRef.current
    const shouldResplit =
      !previousParams ||
      previousParams.mode !== currentParams.mode ||
      previousParams.rows !== currentParams.rows ||
      previousParams.cols !== currentParams.cols ||
      previousParams.outputFormat !== currentParams.outputFormat
    lastAutoSplitParamsRef.current = currentParams

    if (!hasEverSplitRef.current || !state.uploadedImage || state.isProcessing) {
      return
    }

    if (!shouldResplit) {
      debugLog('Auto re-split skipped (no config change or pending state)')
      return
    }

    const currentImage = state.uploadedImage
    const configForSplit: SplitConfig = {
      mode: state.config.mode,
      rows: state.config.rows,
      cols: state.config.cols,
      outputFormat: state.config.outputFormat,
      gridLineWidth: state.config.gridLineWidth
    }

    debugLog('Auto re-split scheduled', currentParams)

    const timeoutId = setTimeout(async () => {
      if (!currentImage) {
        return
      }

      try {
        const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
        const splitImages = await generateSplitImages(currentImage, configForSplit)
        setState((prev) => ({
          ...prev,
          splitImages
        }))
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
        debugLog('Auto re-split completed', {
          duration: endTime - startTime,
          mode: configForSplit.mode,
          rows: configForSplit.rows,
          cols: configForSplit.cols
        })
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auto re-split error:', error)
        }
        debugLog('Auto re-split failed', error)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [
    generateSplitImages,
    state.config.mode,
    state.config.rows,
    state.config.cols,
    state.config.outputFormat,
    state.config.gridLineWidth,
    state.isProcessing,
    state.uploadedImage
  ])

  const splitImage = useCallback(async () => {
    if (!state.uploadedImage) return

    const image = state.uploadedImage
    const config = state.config

    setState((prev) => ({ ...prev, isProcessing: true }))
    debugLog('Manual split requested', {
      width: image.width,
      height: image.height,
      config
    })

    try {
      const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
      const splitImages = await generateSplitImages(image, config)
      hasEverSplitRef.current = true
      setState((prev) => ({
        ...prev,
        splitImages: splitImagesRef.current === splitImages ? [...splitImages] : splitImages,
        isProcessing: false
      }))
      const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now()
      debugLog('Manual split completed', {
        duration: endTime - startTime,
        splits: splitImages.length
      })
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Split image error:', error)
      }
      setState((prev) => ({ ...prev, isProcessing: false }))
      debugLog('Manual split failed', error)
    }
  }, [generateSplitImages, state.config, state.uploadedImage])

  const downloadSingle = useCallback(
    (splitImage: SplitImage, index: number) => {
      downloadSingleImage(splitImage, index, state.config.outputFormat)
    },
    [state.config.outputFormat]
  )

  const downloadAll = useCallback(async () => {
    try {
      await downloadAllImages(state.splitImages, state.config.outputFormat)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'downloadFailed'
      alert(t(`tool.alerts.${errorMessage}`))
    }
  }, [state.splitImages, state.config.outputFormat, t])

  const clampValue = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
  }

  const updateRows = useCallback(
    (value: number) => {
      const clampedValue = clampValue(value, 1, 10)
      updateConfig({ rows: clampedValue })
    },
    [updateConfig]
  )

  const updateCols = useCallback(
    (value: number) => {
      const clampedValue = clampValue(value, 1, 10)
      updateConfig({ cols: clampedValue })
    },
    [updateConfig]
  )

  return {
    uploadedImage: state.uploadedImage,
    splitImages: state.splitImages,
    isProcessing: state.isProcessing,
    config: state.config,
    fileInputRef,
    canvasRef,
    handleFileUpload,
    handleDrop,
    handleFileInputChange,
    updateConfig,
    updateRows,
    updateCols,
    splitImage,
    downloadSingle,
    downloadAll
  }
}
