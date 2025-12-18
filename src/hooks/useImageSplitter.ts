import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import type { SplitConfig, SplitImage } from '@/types'
import { useCropBox } from '@/hooks/useCropBox'
import { useUploadedImage } from '@/hooks/useUploadedImage'
import { useSplitExecutor } from '@/hooks/useSplitExecutor'
import { useSplitDownloads } from '@/hooks/useSplitDownloads'
import { useSplitConfig } from '@/hooks/useSplitConfig'
import { useAutoResplit } from '@/hooks/useAutoResplit'

const defaultConfig: SplitConfig = {
  mode: 'grid',
  rows: 3,
  cols: 3,
  gridLineWidth: 2,
  outputFormat: 'jpg',
  aspectRatio: 'default',
  cropRegion: null
}

export const useImageSplitter = () => {
  const { t } = useTranslation('common')
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null)
  const [splitImages, setSplitImages] = useState<SplitImage[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [config, setConfig] = useState<SplitConfig>(defaultConfig)

  const hasEverSplitRef = useRef(false)
  const uploadedFileRef = useRef<File | null>(null)

  const {
    region: currentCropRegion,
    aspectRatioValue: cropAspectRatioValue,
    shouldRender: shouldShowCrop,
    initialiseForImage,
    updateAspectRatio: syncAspectRatio,
    commitRegion,
    getRegionForSplit
  } = useCropBox(defaultConfig.aspectRatio)

  const handleAspectRatioChange = useCallback(
    (nextRatio: SplitConfig['aspectRatio']) => {
      syncAspectRatio(nextRatio, uploadedImage)
      hasEverSplitRef.current = false
      setSplitImages([])
    },
    [syncAspectRatio, uploadedImage]
  )

  const { updateConfig, updateRows, updateCols } = useSplitConfig(setConfig, {
    onAspectRatioChange: handleAspectRatioChange
  })

  const handleImageLoaded = useCallback(
    (image: HTMLImageElement, file: File) => {
      hasEverSplitRef.current = false
      setUploadedImage(image)
      setSplitImages([])
      uploadedFileRef.current = file
      initialiseForImage(image, config.aspectRatio)
    },
    [config.aspectRatio, initialiseForImage]
  )

  const { fileInputRef, canvasRef, handleDrop, handleFileInputChange } = useUploadedImage({
    onImageLoaded: handleImageLoaded
  })

  const { generateSplitImages, releaseSplitImages, splitImagesRef } = useSplitExecutor()

  useEffect(() => {
    const previous = splitImagesRef.current
    if (previous !== splitImages) {
      if (previous.length > 0) {
        releaseSplitImages(previous)
      }
      splitImagesRef.current = splitImages
    }
  }, [releaseSplitImages, splitImages, splitImagesRef])

  const executeSplit = useCallback(
    (image: HTMLImageElement, nextConfig: SplitConfig) => {
      return generateSplitImages(image, nextConfig, uploadedFileRef.current)
    },
    [generateSplitImages]
  )

  useAutoResplit({
    config,
    uploadedImage,
    isProcessing,
    hasEverSplitRef,
    getRegionForSplit,
    generateSplitImages: executeSplit,
    setSplitImages
  })

  const splitImage = useCallback(async () => {
    if (!uploadedImage) return

    const configForSplit: SplitConfig = {
      ...config,
      cropRegion: getRegionForSplit()
    }

    setIsProcessing(true)

    try {
      const splitResult = await executeSplit(uploadedImage, configForSplit)
      hasEverSplitRef.current = true
      setSplitImages(splitResult)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Split image error:', error)
      }
    } finally {
      setIsProcessing(false)
    }
  }, [config, executeSplit, getRegionForSplit, uploadedImage])

  const { downloadSingle: rawDownloadSingle, downloadAll: rawDownloadAll } = useSplitDownloads()

  const downloadSingle = useCallback(
    (splitImageItem: SplitImage, index: number) => {
      rawDownloadSingle(splitImageItem, index, config.outputFormat)
    },
    [config.outputFormat, rawDownloadSingle]
  )

  const downloadAll = useCallback(async () => {
    await rawDownloadAll(splitImages, config.outputFormat, (errorKey) => {
      alert(t(`tool.alerts.${errorKey}`))
    })
  }, [config.outputFormat, rawDownloadAll, splitImages, t])

  return {
    uploadedImage,
    splitImages,
    isProcessing,
    config,
    fileInputRef,
    canvasRef,
    handleDrop,
    handleFileInputChange,
    updateConfig,
    cropRegion: currentCropRegion,
    cropAspectRatioValue,
    shouldShowCrop,
    onCropRegionCommit: commitRegion,
    updateRows,
    updateCols,
    splitImage,
    downloadSingle,
    downloadAll
  }
}

