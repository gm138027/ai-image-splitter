import React, { useEffect } from 'react'
import { useImageSplitter } from '@/hooks/useImageSplitter'
import HeroSection from './HeroSection'
import SplitControls from './SplitControls'
import ImagePreview from './ImagePreview'

interface ImageSplitterProps {
  onToolModeChange?: (inToolMode: boolean) => void
}

const ImageSplitter: React.FC<ImageSplitterProps> = ({ onToolModeChange }) => {
  const {
    // 状态
    uploadedImage,
    splitImages,
    isProcessing,
    config,
    
    // Refs
    fileInputRef,
    canvasRef,
    
    // 方法
    handleFileUpload,
    handleDrop,
    handleFileInputChange,
    updateConfig,
    splitImage,
    downloadSingle,
    downloadAll
  } = useImageSplitter()

  // 监听上传图片状态变化，通知父组件工具模式状态
  useEffect(() => {
    if (onToolModeChange) {
      onToolModeChange(!!uploadedImage)
    }
  }, [uploadedImage, onToolModeChange])

  // If no image uploaded, show Hero section
  if (!uploadedImage) {
    return (
      <HeroSection
        onFileUpload={handleFileUpload}
        onDrop={handleDrop}
        onFileInputChange={handleFileInputChange}
        fileInputRef={fileInputRef}
      />
    )
  }

  // 有图片时显示工作区域
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Control Panel */}
          <SplitControls
            config={config}
            onConfigChange={updateConfig}
            onSplit={splitImage}
            onDownloadAll={downloadAll}
            isProcessing={isProcessing}
            hasSplitImages={splitImages.length > 0}
          />

          {/* Right Preview Area */}
          <ImagePreview
            uploadedImage={uploadedImage}
            splitImages={splitImages}
            config={config}
            onDownloadSingle={downloadSingle}
            fileInputRef={fileInputRef}
          />
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input for re-upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
}

export default ImageSplitter 