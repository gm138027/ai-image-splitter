import { useCallback, useEffect, useRef } from 'react'
import type { SplitConfig, SplitImage } from '@/types'
import { splitImage as splitImageUtil, calculateSplitParams } from '@/utils/imageProcessing'

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

// eslint-disable-next-line no-unused-vars
type ResolveHandler = (value: WorkerSplitResult) => void
// eslint-disable-next-line no-unused-vars
type RejectHandler = (reason?: unknown) => void

interface PendingRequestHandlers {
  resolve: ResolveHandler
  reject: RejectHandler
}

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

const detectWorkerSupport = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const hasWorker = 'Worker' in window
  const hasBitmap = typeof window.createImageBitmap === 'function'
  const hasOffscreen = typeof (window as any).OffscreenCanvas !== 'undefined'

  return hasWorker && hasBitmap && hasOffscreen
}

const createRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `split-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const debugLog = (...args: unknown[]) => {
  if (
    (typeof window !== 'undefined' && (window as any).__AI_IMAGE_SPLITTER_DEBUG === false) ||
    (typeof window === 'undefined' && process.env.NODE_ENV !== 'development')
  ) {
    return
  }

  if (typeof window === 'undefined') {
    console.log('[SplitExecutor]', ...args)
  } else {
    const globalFlag = (window as any).__AI_IMAGE_SPLITTER_DEBUG
    if (globalFlag !== false) {
      console.log('[SplitExecutor]', ...args)
    }
  }
}

export const useSplitExecutor = () => {
  const workerSupportedRef = useRef<boolean>(detectWorkerSupport())
  const workerRef = useRef<Worker | null>(null)
  const pendingRequestsRef = useRef<Map<string, PendingRequestHandlers>>(new Map())
  const splitImagesRef = useRef<SplitImage[]>([])

  const releaseSplitImages = useCallback((images: SplitImage[]) => {
    images.forEach((image) => {
      URL.revokeObjectURL(image.objectUrl)
    })
  }, [])

  const preloadSplitImages = useCallback(async (images: SplitImage[]) => {
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
  }, [])

  const disposeWorker = useCallback(() => {
    if (workerRef.current) {
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
      pending.resolve({ format: message.format, splits: message.splits })
    } else {
      pending.reject(new Error(message.error || 'Worker split failed'))
    }
  }, [])

  const handleWorkerError = useCallback(
    (event: ErrorEvent | MessageEvent) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Image split worker error:', event)
      }
      workerSupportedRef.current = false
      rejectAllPending(new Error('Worker execution failed'))
      disposeWorker()
    },
    [disposeWorker, rejectAllPending]
  )

  const ensureWorker = useCallback(() => {
    if (!workerSupportedRef.current) {
      return null
    }

    if (workerRef.current) {
      return workerRef.current
    }

    try {
      const worker = new Worker(new URL('../workers/imageSplitter.worker.ts', import.meta.url), {
        type: 'module'
      })
      worker.onmessage = handleWorkerMessage
      worker.onerror = handleWorkerError
      worker.onmessageerror = handleWorkerError as any
      workerRef.current = worker
      return worker
    } catch (error) {
      workerSupportedRef.current = false
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to initialise image split worker:', error)
      }
      return null
    }
  }, [handleWorkerError, handleWorkerMessage])

  useEffect(() => {
    const ref = splitImagesRef
    return () => {
      const current = ref.current
      disposeWorker()
      rejectAllPending(new Error('Worker disposed'))
      releaseSplitImages(current)
    }
  }, [disposeWorker, releaseSplitImages, rejectAllPending, splitImagesRef])

  const buildSplitImagesFromWorker = useCallback((result: WorkerSplitResult): SplitImage[] => {
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
  }, [])

  const splitWithWorker = useCallback(
    async (sourceFile: Blob, width: number, height: number, config: SplitConfig): Promise<SplitImage[]> => {
      const worker = ensureWorker()
      if (!worker) {
        throw new Error('Worker not available')
      }

      const requestId = createRequestId()

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
        throw error
      }

      const result = await resultPromise
      return buildSplitImagesFromWorker(result)
    },
    [buildSplitImagesFromWorker, ensureWorker]
  )

  const splitWithWorkerPool = useCallback(
    async (sourceFile: File, image: HTMLImageElement, config: SplitConfig, workerCount: number) => {
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
            const worker = new Worker(new URL('../workers/imageSplitter.worker.ts', import.meta.url), {
              type: 'module'
            })

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
    async (image: HTMLImageElement, config: SplitConfig, sourceFile: File | null): Promise<SplitImage[]> => {
      let result: SplitImage[]

      const { splitCount } = calculateSplitParams(image, config)
      const hardwareLimit =
        typeof navigator !== 'undefined' && navigator.hardwareConcurrency
          ? navigator.hardwareConcurrency
          : 1
      const desiredWorkers = Math.min(MAX_PARALLEL_WORKERS, hardwareLimit, splitCount)
      const shouldUsePool = workerSupportedRef.current && sourceFile && desiredWorkers > 1 && splitCount >= 16

      if (shouldUsePool && sourceFile) {
        try {
          result = await splitWithWorkerPool(sourceFile, image, config, desiredWorkers)
        } catch (error) {
          result = await splitWithWorker(sourceFile, image.width, image.height, config)
        }
      } else if (workerSupportedRef.current && sourceFile) {
        try {
          result = await splitWithWorker(sourceFile, image.width, image.height, config)
        } catch (error) {
          workerSupportedRef.current = false
          disposeWorker()
          rejectAllPending(error)
          result = await splitImageUtil(image, config)
        }
      } else {
        result = await splitImageUtil(image, config)
      }

      await preloadSplitImages(result)
      return result
    },
    [disposeWorker, preloadSplitImages, rejectAllPending, splitWithWorker, splitWithWorkerPool]
  )

  return {
    generateSplitImages,
    releaseSplitImages,
    splitImagesRef
  }
}
