import React from 'react'
import { useTranslation } from 'next-i18next'
import { Upload, Download } from 'lucide-react'
import type { ImagePreviewProps } from '@/types'

const ImagePreview: React.FC<ImagePreviewProps> = ({
  uploadedImage,
  splitImages,
  config,
  onDownloadSingle,
  onReupload,
  fileInputRef
}) => {
  const { t } = useTranslation('common')

  // 网格线功能已移除，保持界面干净简洁

  // 渲染原图预览
  const renderOriginalImage = () => (
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
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={uploadedImage!.src}
          alt="Upload preview"
          style={{ 
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
        {/* 移除网格线显示 */}
      </div>
    </div>
  )

  // 渲染分割结果
  const renderSplitImages = () => {
    if (!uploadedImage) return null;

    // 计算原图的显示尺寸以保持相同的缩放比例
    const containerWidth = 520; // 预览容器宽度减去padding
    const containerHeight = 520; // 预览容器高度减去padding
    
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
        <div style={{
          width: `${displayWidth}px`,
          height: `${displayHeight}px`,
          backgroundColor: config.gridLineWidth > 0 ? '#ffffff' : 'transparent',
          padding: config.gridLineWidth > 0 ? `${config.gridLineWidth}px` : '0',
          boxSizing: 'content-box'
        }}>
          {/* Create rows */}
          {Array.from({ 
            length: config.mode === 'horizontal' ? config.rows : 
                   config.mode === 'vertical' ? 1 : config.rows 
          }, (_, rowIndex) => (
            <div key={rowIndex} style={{
              display: 'flex',
              height: `${displayHeight / (config.mode === 'horizontal' ? config.rows : 
                                         config.mode === 'vertical' ? 1 : config.rows)}px`,
              marginBottom: rowIndex < (config.mode === 'horizontal' ? config.rows : 
                                       config.mode === 'vertical' ? 1 : config.rows) - 1 
                           ? `${config.gridLineWidth}px` : '0'
            }}>
              {/* Create columns in each row */}
              {Array.from({ 
                length: config.mode === 'horizontal' ? 1 : 
                       config.mode === 'vertical' ? config.cols : config.cols 
              }, (_, colIndex) => {
                const imageIndex = config.mode === 'horizontal' ? rowIndex : 
                                  config.mode === 'vertical' ? colIndex :
                                  rowIndex * config.cols + colIndex;
                const img = splitImages[imageIndex];
                
                if (!img) return null;
                
                return (
                  <div key={img.id} className="relative group" style={{
                    width: `${displayWidth / (config.mode === 'horizontal' ? 1 : 
                                             config.mode === 'vertical' ? config.cols : config.cols)}px`,
                    height: '100%',
                    marginRight: colIndex < (config.mode === 'horizontal' ? 1 : 
                                            config.mode === 'vertical' ? config.cols : config.cols) - 1 
                                ? `${config.gridLineWidth}px` : '0'
                  }}>
                    <img
                      src={img.canvas.toDataURL()}
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
                        className="bg-white text-gray-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg"
                      >
                        <Download className="w-4 h-4 inline mr-1" />
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
      {/* Fixed Size Preview Container */}
      <div 
        className="border border-gray-200 rounded-lg bg-gray-50 relative" 
        style={{ height: '560px', overflow: 'hidden' }}
      >
        {/* Original Image Preview with Grid Overlay */}
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