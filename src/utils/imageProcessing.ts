import type { SplitImage, SplitConfig } from '@/types'

/**
 * 验证文件是否为有效的图像文件
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'invalidFileType' }
  }
  
  // 检查文件大小 (最大10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'fileTooLarge' }
  }
  
  return { isValid: true }
}

/**
 * 创建图像对象从文件
 */
export const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      reject(new Error(validation.error || 'Invalid file'))
      return
    }

    const img = new Image()
    img.onload = () => {
      // 检查图片尺寸 (最大4096x4096)
      const maxDimension = 4096
      if (img.width > maxDimension || img.height > maxDimension) {
        reject(new Error('imageTooLarge'))
        return
      }
      resolve(img)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 计算分割参数
 */
export const calculateSplitParams = (
  image: HTMLImageElement,
  config: SplitConfig
) => {
  const { mode, rows, cols } = config
  const imgWidth = image.width
  const imgHeight = image.height

  let splitCount = 0
  let splitWidth = 0
  let splitHeight = 0

  switch (mode) {
    case 'vertical':
      splitCount = cols
      splitWidth = imgWidth / cols
      splitHeight = imgHeight
      break
    case 'horizontal':
      splitCount = rows
      splitWidth = imgWidth
      splitHeight = imgHeight / rows
      break
    case 'grid':
      splitCount = rows * cols
      splitWidth = imgWidth / cols
      splitHeight = imgHeight / rows
      break
  }

  return { splitCount, splitWidth, splitHeight }
}

/**
 * 计算分割位置
 */
export const calculateSplitPosition = (
  index: number,
  config: SplitConfig,
  splitWidth: number,
  splitHeight: number
) => {
  const { mode, cols } = config
  let sx = 0
  let sy = 0

  switch (mode) {
    case 'vertical':
      sx = (index % cols) * splitWidth
      sy = 0
      break
    case 'horizontal':
      sx = 0
      sy = index * splitHeight
      break
    case 'grid':
      sx = (index % cols) * splitWidth
      sy = Math.floor(index / cols) * splitHeight
      break
  }

  return { sx, sy }
}

/**
 * 创建分割图像
 */
export const createSplitImage = async (
  sourceImage: HTMLImageElement,
  index: number,
  config: SplitConfig,
  splitWidth: number,
  splitHeight: number
): Promise<SplitImage> => {
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = splitWidth
  tempCanvas.height = splitHeight
  const tempCtx = tempCanvas.getContext('2d')!

  const { sx, sy } = calculateSplitPosition(index, config, splitWidth, splitHeight)

  // 绘制图片
  tempCtx.drawImage(
    sourceImage,
    sx, sy, splitWidth, splitHeight,
    0, 0, splitWidth, splitHeight
  )

  // 转换为Blob
  const blob = await new Promise<Blob>((resolve) => {
    tempCanvas.toBlob((blob) => resolve(blob!), `image/${config.outputFormat}`)
  })

  return {
    id: `split-${index}`,
    canvas: tempCanvas,
    blob
  }
}

/**
 * 主要的图像分割函数
 */
export const splitImage = async (
  sourceImage: HTMLImageElement,
  config: SplitConfig
): Promise<SplitImage[]> => {
  const { splitCount, splitWidth, splitHeight } = calculateSplitParams(sourceImage, config)
  const splitImages: SplitImage[] = []

  for (let i = 0; i < splitCount; i++) {
    const splitImg = await createSplitImage(
      sourceImage,
      i,
      config,
      splitWidth,
      splitHeight
    )
    splitImages.push(splitImg)
  }

  return splitImages
}

/**
 * 下载单个图像
 */
export const downloadSingleImage = (
  splitImage: SplitImage,
  index: number,
  format: string
) => {
  const link = document.createElement('a')
  link.download = `split-image-${index + 1}.${format}`
  link.href = URL.createObjectURL(splitImage.blob)
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // 清理内存
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
  }, 100)
}

/**
 * 批量下载图像（ZIP格式）
 */
export const downloadAllImages = async (
  splitImages: SplitImage[],
  format: string
) => {
  if (splitImages.length === 0) return

  try {
    // 动态导入JSZip以减小初始包大小
    const JSZip = (await import('jszip')).default
    const zip = new JSZip()

    // 将所有分割图片添加到压缩包
    splitImages.forEach((img, index) => {
      zip.file(`split-image-${index + 1}.${format}`, img.blob)
    })

    // 生成压缩包并下载
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6
      }
    })
    
    const link = document.createElement('a')
    link.download = 'split-images.zip'
    link.href = URL.createObjectURL(content)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // 清理内存
    URL.revokeObjectURL(link.href)
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Download all images error:', error)
    }
    throw new Error('downloadFailed')
  }
} 