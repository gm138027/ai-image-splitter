import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import type { SplitImage, SplitConfig, ImageSplitterState } from '@/types'
import { 
  createImageFromFile, 
  splitImage as splitImageUtil,
  downloadSingleImage,
  downloadAllImages
} from '@/utils/imageProcessing'

/**
 * 图像分割功能的自定义Hook
 */
export const useImageSplitter = () => {
  const { t } = useTranslation('common')

  // 默认配置
  const defaultConfig: SplitConfig = {
    mode: 'grid',
    rows: 3,
    cols: 3,
    gridLineWidth: 2,
    outputFormat: 'jpg'
  }

  // 状态管理
  const [state, setState] = useState<ImageSplitterState>({
    uploadedImage: null,
    splitImages: [],
    isProcessing: false,
    config: defaultConfig
  })

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hasEverSplitRef = useRef(false) // 跟踪是否曾经分割过

  // 处理文件上传
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const img = await createImageFromFile(file)
      hasEverSplitRef.current = false // 重置分割标记
      setState(prev => ({
        ...prev,
        uploadedImage: img,
        splitImages: []
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'invalidFile'
      
      // 根据错误类型显示不同的提示信息
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
    }
  }, [t])

  // 处理拖拽
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  // 处理文件输入变化
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      // 重置分割结果，加载新图片
      setState(prev => ({
        ...prev,
        splitImages: []
      }))
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  // 更新配置
  const updateConfig = useCallback((newConfig: Partial<SplitConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }))
  }, [])

  // 监听配置变化，自动重新分割
  useEffect(() => {
    const autoReSplit = async () => {
      // 只有在曾经分割过、有上传图片且不在处理中的情况下才自动重新分割
      if (hasEverSplitRef.current && state.uploadedImage && !state.isProcessing) {
        try {
          const splitImages = await splitImageUtil(state.uploadedImage, state.config)
          setState(prev => ({
            ...prev,
            splitImages
          }))
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Auto re-split error:', error)
          }
        }
      }
    }

    autoReSplit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.config.mode, state.config.rows, state.config.cols, state.config.outputFormat])

  // 分割图像
  const splitImage = useCallback(async () => {
    if (!state.uploadedImage) return

    setState(prev => ({ ...prev, isProcessing: true }))

    try {
      const splitImages = await splitImageUtil(state.uploadedImage, state.config)
      hasEverSplitRef.current = true // 标记已经分割过
      setState(prev => ({
        ...prev,
        splitImages,
        isProcessing: false
      }))
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Split image error:', error)
      }
      setState(prev => ({ ...prev, isProcessing: false }))
    }
  }, [state.uploadedImage, state.config])

  // 下载单个图像
  const downloadSingle = useCallback((splitImage: SplitImage, index: number) => {
    downloadSingleImage(splitImage, index, state.config.outputFormat)
  }, [state.config.outputFormat])

  // 下载所有图像
  const downloadAll = useCallback(async () => {
    try {
      await downloadAllImages(state.splitImages, state.config.outputFormat)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'downloadFailed'
      alert(t(`tool.alerts.${errorMessage}`))
    }
  }, [state.splitImages, state.config.outputFormat, t])

  // 重新上传 - 直接触发文件选择
  const handleReupload = useCallback(() => {
    // 清空之前的文件输入值，确保可以选择相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
      fileInputRef.current.click()
    }
  }, [])

  // 数值范围限制
  const clampValue = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value))
  }

  // 更新行数
  const updateRows = useCallback((value: number) => {
    const clampedValue = clampValue(value, 1, 10)
    updateConfig({ rows: clampedValue })
  }, [updateConfig])

  // 更新列数
  const updateCols = useCallback((value: number) => {
    const clampedValue = clampValue(value, 1, 10)
    updateConfig({ cols: clampedValue })
  }, [updateConfig])

  return {
    // 状态
    uploadedImage: state.uploadedImage,
    splitImages: state.splitImages,
    isProcessing: state.isProcessing,
    config: state.config,
    
    // Refs
    fileInputRef,
    canvasRef,
    
    // 方法
    handleFileUpload,
    handleDrop,
    handleFileInputChange,
    updateConfig,
    updateRows,
    updateCols,
    splitImage,
    downloadSingle,
    downloadAll,
    handleReupload
  }
} 