import { useEffect, useRef } from 'react'
import type { SplitConfig, SplitImage } from '@/types'

// eslint-disable-next-line no-unused-vars
type GenerateSplitImages = (image: HTMLImageElement, config: SplitConfig) => Promise<SplitImage[]>

interface AutoResplitOptions {
  config: SplitConfig
  uploadedImage: HTMLImageElement | null
  isProcessing: boolean
  hasEverSplitRef: React.MutableRefObject<boolean>
  getRegionForSplit: () => SplitConfig['cropRegion']
  generateSplitImages: GenerateSplitImages
  setSplitImages: React.Dispatch<React.SetStateAction<SplitImage[]>>
}

export const useAutoResplit = ({
  config,
  uploadedImage,
  isProcessing,
  hasEverSplitRef,
  getRegionForSplit,
  generateSplitImages,
  setSplitImages
}: AutoResplitOptions) => {
  const lastParamsRef = useRef<{
    mode: SplitConfig['mode']
    rows: number
    cols: number
    outputFormat: SplitConfig['outputFormat']
    aspectRatio: SplitConfig['aspectRatio']
  } | null>(null)

  useEffect(() => {
    if (!hasEverSplitRef.current || !uploadedImage || isProcessing) {
      // Reset baseline when user has not completed a split yet.
      if (!hasEverSplitRef.current) {
        lastParamsRef.current = null
      }
      return
    }

    const currentParams = {
      mode: config.mode,
      rows: config.rows,
      cols: config.cols,
      outputFormat: config.outputFormat,
      aspectRatio: config.aspectRatio
    }
    const previousParams = lastParamsRef.current
    if (!previousParams) {
      // Treat the first post-split render as baseline to avoid duplicate split.
      lastParamsRef.current = currentParams
      return
    }

    const shouldResplit =
      previousParams.mode !== currentParams.mode ||
      previousParams.rows !== currentParams.rows ||
      previousParams.cols !== currentParams.cols ||
      previousParams.outputFormat !== currentParams.outputFormat ||
      previousParams.aspectRatio !== currentParams.aspectRatio

    lastParamsRef.current = currentParams

    if (!shouldResplit) {
      return
    }

    let didCancel = false
    const timeoutId = setTimeout(async () => {
      if (didCancel || !uploadedImage) {
        return
      }
      try {
        const nextConfig: SplitConfig = {
          ...config,
          cropRegion: getRegionForSplit()
        }
        const splitImages = await generateSplitImages(uploadedImage, nextConfig)
        if (!didCancel) {
          setSplitImages(splitImages)
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Auto re-split error:', error)
        }
      }
    }, 100)

    return () => {
      didCancel = true
      clearTimeout(timeoutId)
    }
  }, [
    config,
    generateSplitImages,
    getRegionForSplit,
    hasEverSplitRef,
    isProcessing,
    setSplitImages,
    uploadedImage
  ])
}
