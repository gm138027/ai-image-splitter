import { useCallback, useEffect, useRef } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { createImageFromFile } from '@/utils/imageProcessing'

// eslint-disable-next-line no-unused-vars
type ImageLoadedHandler = (image: HTMLImageElement, file: File) => void

interface UseUploadedImageOptions {
  onImageLoaded: ImageLoadedHandler
}

export const useUploadedImage = ({ onImageLoaded }: UseUploadedImageOptions) => {
  const { t } = useTranslation('common')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const uploadedImageObjectUrlRef = useRef<string | null>(null)

  const releaseUploadedImage = useCallback(() => {
    if (uploadedImageObjectUrlRef.current) {
      URL.revokeObjectURL(uploadedImageObjectUrlRef.current)
      uploadedImageObjectUrlRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      releaseUploadedImage()
    }
  }, [releaseUploadedImage])

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        const { image, objectUrl } = await createImageFromFile(file)
        releaseUploadedImage()
        uploadedImageObjectUrlRef.current = objectUrl
        onImageLoaded(image, file)
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
      }
    },
    [onImageLoaded, releaseUploadedImage, t]
  )

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload]
  )

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files && files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload]
  )

  return {
    fileInputRef,
    canvasRef,
    handleDrop,
    handleFileInputChange
  }
}
