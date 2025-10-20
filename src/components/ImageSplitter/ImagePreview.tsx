import React, { useRef, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Upload, Download } from 'lucide-react'
import type { ImagePreviewProps } from '@/types'

const ImagePreview: React.FC<ImagePreviewProps> = ({
  uploadedImage,
  splitImages,
  config,
  onDownloadSingle,
  fileInputRef
}) => {
  const { t } = useTranslation('common')
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  // 监听容器尺寸变化
  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        // 减去padding (20px * 2)
        const availableWidth = rect.width - 40
        const availableHeight = rect.height - 40
        setContainerSize({ width: availableWidth, height: availableHeight })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)
    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  // 渲染原图预览
  const renderOriginalImage = () => {
    if (!uploadedImage || containerSize.width === 0 || containerSize.height === 0) return null;

    // 计算原图的显示尺寸，保持比例
    const containerWidth = containerSize.width;
    const containerHeight = containerSize.height;
    
    const imageAspectRatio = uploadedImage.width / uploadedImage.height;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let displayWidth, displayHeight;
    
    if (imageAspectRatio > containerAspectRatio) {
      // 图片更宽，以宽度为准
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspectRatio;
    } else {
      // 图片更高，以高度为准
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageAspectRatio;
    }

    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div className="relative" style={{ 
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={uploadedImage!.src}
            alt="Upload preview"
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'contain', // 保持原图比例
              display: 'block'
            }}
          />
        </div>
      </div>
    )
  }

  // 渲染分割结果
  const renderSplitImages = () => {
    if (!uploadedImage || containerSize.width === 0 || containerSize.height === 0) return null;

    // 使用实际容器尺寸计算显示尺寸
    const containerWidth = containerSize.width;
    const containerHeight = containerSize.height;
    
    const imageAspectRatio = uploadedImage.width / uploadedImage.height;
    const containerAspectRatio = containerWidth / containerHeight;
    
    let displayWidth, displayHeight;
    
    if (imageAspectRatio > containerAspectRatio) {
      // 图片更宽，以宽度为准
      displayWidth = containerWidth;
      displayHeight = containerWidth / imageAspectRatio;
    } else {
      // 图片更高，以高度为准
      displayHeight = containerHeight;
      displayWidth = containerHeight * imageAspectRatio;
    }

    // 计算切割网格的行列数
    const actualRows = config.mode === 'horizontal' ? config.rows : 
                      config.mode === 'vertical' ? 1 : config.rows;
    const actualCols = config.mode === 'horizontal' ? 1 : 
                      config.mode === 'vertical' ? config.cols : config.cols;

    // 计算每个切片的尺寸（不包括网格线）
    const totalGridLineWidth = (actualCols - 1) * config.gridLineWidth;
    const totalGridLineHeight = (actualRows - 1) * config.gridLineWidth;
    const cellWidth = (displayWidth - totalGridLineWidth) / actualCols;
    const cellHeight = (displayHeight - totalGridLineHeight) / actualRows;

    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          backgroundColor: config.gridLineWidth > 0 ? '#ffffff' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: `${config.gridLineWidth}px`
        }}>
          {/* Create rows */}
          {Array.from({ length: actualRows }, (_, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'flex',
              height: `${cellHeight}px`,
              gap: `${config.gridLineWidth}px`
            }}>
              {/* Create columns in each row */}
              {Array.from({ length: actualCols }, (_, colIndex) => {
                const imageIndex = config.mode === 'horizontal' ? rowIndex : 
                                  config.mode === 'vertical' ? colIndex :
                                  rowIndex * actualCols + colIndex;
                const img = splitImages[imageIndex];
                
                if (!img) return null;
                
                return (
                  <div key={img.id} className="relative group" style={{
                    width: `${cellWidth}px`,
                    height: `${cellHeight}px`,
                    flexShrink: 0
                  }}>
                    <img
                      src={img.objectUrl}
                      alt={`Split ${imageIndex + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain', // 改为contain，保持图片比例
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
                );
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 relative">
      {/* 响应式预览容器 */}
      <div 
        ref={containerRef}
        className="border border-gray-200 rounded-lg bg-gray-50 relative w-full"
        style={{ 
          height: 'min(70vh, 600px)', // 限制最大高度，在移动端更合适
          minHeight: '300px', // 减少最小高度
          overflow: 'hidden'
        }}
      >
        {/* Original Image Preview */}
        {splitImages.length === 0 && uploadedImage && renderOriginalImage()}

        {/* Split Images Display */}
        {splitImages.length > 0 && renderSplitImages()}
      </div>

      {/* Re-upload Button - Always visible below the preview */}
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
