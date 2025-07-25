import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useImageSplitter } from '@/hooks/useImageSplitter'
import HeroSection from './HeroSection'

// Dynamic import tool components to reduce initial bundle size
const SplitControls = dynamic(() => import('./SplitControls'), {
  loading: () => <div className="w-full lg:w-1/3 h-96 bg-gray-100 animate-pulse rounded-l-2xl" />,
  ssr: false,
})

const ImagePreview = dynamic(() => import('./ImagePreview'), {
  loading: () => <div className="flex-1 h-96 bg-gray-50 animate-pulse rounded-r-2xl" />,
  ssr: false,
})

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
    downloadAll,
    handleReupload
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
            onReupload={handleReupload}
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