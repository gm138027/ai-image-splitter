import { useCallback } from 'react'
import { downloadSingleImage, downloadAllImages } from '@/utils/imageProcessing'
import type { SplitImage } from '@/types'

// eslint-disable-next-line no-unused-vars
type DownloadErrorHandler = (errorKey: string) => void

export const useSplitDownloads = () => {
  const downloadSingle = useCallback(
    (splitImage: SplitImage, index: number, format: string) => {
      downloadSingleImage(splitImage, index, format)
    },
    []
  )

  const downloadAll = useCallback(async (splitImages: SplitImage[], format: string, onError: DownloadErrorHandler) => {
    try {
      await downloadAllImages(splitImages, format)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'downloadFailed'
      onError(errorMessage)
    }
  }, [])

  return {
    downloadSingle,
    downloadAll
  }
}
