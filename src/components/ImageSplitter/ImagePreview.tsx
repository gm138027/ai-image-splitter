import React, { useRef, useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'next-i18next'
import { Upload, Download } from 'lucide-react'
import type { ImagePreviewProps } from '@/types'
import CropOverlay from './CropOverlay'

const ImagePreview: React.FC<ImagePreviewProps> = ({
  uploadedImage,
  splitImages,
  config,
  cropRegion,
  cropAspectRatioValue,
  shouldShowCrop,
  onCropRegionCommit,
  previewRows,
  previewCols,
  onDownloadSingle,
  fileInputRef
}) => {
  const { t } = useTranslation('common')
  const containerRef = useRef<HTMLDivElement>(null)
  const imageAreaRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const availableWidth = rect.width - 40
        const availableHeight = rect.height - 40
        setContainerSize({ width: availableWidth, height: availableHeight })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  const displaySize = useMemo(() => {
    if (!uploadedImage || containerSize.width === 0 || containerSize.height === 0) {
      return null
    }

    const containerWidth = containerSize.width
    const containerHeight = containerSize.height

    const imageAspectRatio = uploadedImage.width / uploadedImage.height
    const containerAspectRatio = containerWidth / containerHeight

    if (imageAspectRatio > containerAspectRatio) {
      return {
        width: containerWidth,
        height: containerWidth / imageAspectRatio
      }
    }

    return {
      height: containerHeight,
      width: containerHeight * imageAspectRatio
    }
  }, [containerSize.height, containerSize.width, uploadedImage])

  const renderOriginalImage = () => {
    if (!uploadedImage || !displaySize) return null

    const shouldRenderOverlay =
      shouldShowCrop && !!cropRegion && !!cropAspectRatioValue && splitImages.length === 0

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <div
          ref={imageAreaRef}
          className="relative"
          style={{
            width: `${displaySize.width}px`,
            height: `${displaySize.height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={uploadedImage.src}
            alt="Upload preview"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
          {shouldRenderOverlay && (
            <CropOverlay
              containerRef={imageAreaRef}
              cropRegion={cropRegion}
              aspectRatioValue={cropAspectRatioValue}
              displayWidth={displaySize.width}
              displayHeight={displaySize.height}
              imageWidth={uploadedImage.width}
              imageHeight={uploadedImage.height}
              rows={previewRows}
              cols={previewCols}
              onCropRegionCommit={onCropRegionCommit}
            />
          )}
        </div>
      </div>
    )
  }

  const renderSplitImages = () => {
    if (!uploadedImage || !displaySize) return null

    const actualRows = previewRows
    const actualCols = previewCols
    let effectiveWidth = displaySize.width
    let effectiveHeight = displaySize.height

    if (cropRegion && shouldShowCrop) {
      const scaleX = displaySize.width / uploadedImage.width
      const scaleY = displaySize.height / uploadedImage.height
      effectiveWidth = Math.round(cropRegion.width * scaleX)
      effectiveHeight = Math.round(cropRegion.height * scaleY)
    } else {
      effectiveWidth = Math.round(effectiveWidth)
      effectiveHeight = Math.round(effectiveHeight)
    }

    const totalGridLineWidth = (actualCols - 1) * config.gridLineWidth
    const totalGridLineHeight = (actualRows - 1) * config.gridLineWidth
    const cellWidth = (effectiveWidth - totalGridLineWidth) / actualCols
    const cellHeight = (effectiveHeight - totalGridLineHeight) / actualRows

    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          boxSizing: 'border-box'
        }}
      >
        <div
          style={{
            width: `${effectiveWidth}px`,
            height: `${effectiveHeight}px`,
            backgroundColor: config.gridLineWidth > 0 ? '#ffffff' : 'transparent',
            display: 'flex',
            flexDirection: 'column',
            gap: `${config.gridLineWidth}px`
          }}
        >
          {Array.from({ length: actualRows }, (_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              style={{
                display: 'flex',
                height: `${cellHeight}px`,
                gap: `${config.gridLineWidth}px`
              }}
            >
              {Array.from({ length: actualCols }, (_, colIndex) => {
                const imageIndex =
                  config.mode === 'horizontal'
                    ? rowIndex
                    : config.mode === 'vertical'
                      ? colIndex
                      : rowIndex * actualCols + colIndex

                const img = splitImages[imageIndex]
                if (!img) return null

                return (
                  <div
                    key={img.id}
                    className="relative group"
                    style={{
                      width: `${cellWidth}px`,
                      height: `${cellHeight}px`,
                      flexShrink: 0
                    }}
                  >
                    <img
                      src={img.objectUrl}
                      alt={`Split ${imageIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => onDownloadSingle(img, imageIndex)}
                        className="bg-white text-gray-700 px-2 py-1 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        {t('tool.buttons.download')}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const showPlaceholder = !uploadedImage

  return (
    <div className="flex-1 p-6 relative">
      <div
        ref={containerRef}
        className="border border-gray-200 rounded-lg bg-gray-50 relative w-full"
        style={{
          height: 'min(70vh, 600px)',
          minHeight: '300px',
          overflow: 'hidden'
        }}
      >
        {showPlaceholder && (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
            {t('tool.uploadImageFirst')}
          </div>
        )}

        {!showPlaceholder && splitImages.length === 0 && renderOriginalImage()}
        {!showPlaceholder && splitImages.length > 0 && renderSplitImages()}
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          <Upload className="w-4 h-4 inline mr-2" />
          {t('tool.buttons.reupload')}
        </button>
      </div>
    </div>
  )
}

export default ImagePreview
