import type { SplitImage, SplitConfig } from '@/types'

/**
 * Check if we're running in browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * Validate if file is a valid image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'invalidFileType' }
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'fileTooLarge' }
  }
  
  return { isValid: true }
}

/**
 * Create image object from file
 */
export const createImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // Only run in browser environment
    if (!isBrowser) {
      reject(new Error('This function can only run in browser environment'))
      return
    }

    const validation = validateImageFile(file)
    if (!validation.isValid) {
      reject(new Error(validation.error || 'Invalid file'))
      return
    }

    const img = new Image()
    img.onload = () => {
      // Check image dimensions (max 4096x4096)
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
 * Calculate split parameters
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
 * Calculate split position
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
 * Create split image
 */
export const createSplitImage = async (
  sourceImage: HTMLImageElement,
  index: number,
  config: SplitConfig,
  splitWidth: number,
  splitHeight: number
): Promise<SplitImage> => {
  // Only run in browser environment
  if (!isBrowser) {
    throw new Error('This function can only run in browser environment')
  }

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = splitWidth
  tempCanvas.height = splitHeight
  const tempCtx = tempCanvas.getContext('2d')!

  const { sx, sy } = calculateSplitPosition(index, config, splitWidth, splitHeight)

  // Draw image
  tempCtx.drawImage(
    sourceImage,
    sx, sy, splitWidth, splitHeight,
    0, 0, splitWidth, splitHeight
  )

  // Convert to Blob
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
 * Main image splitting function
 */
export const splitImage = async (
  sourceImage: HTMLImageElement,
  config: SplitConfig
): Promise<SplitImage[]> => {
  // Only run in browser environment
  if (!isBrowser) {
    throw new Error('This function can only run in browser environment')
  }

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
 * Download single image
 */
export const downloadSingleImage = (
  splitImage: SplitImage,
  index: number,
  format: string
) => {
  // Only run in browser environment
  if (!isBrowser) {
    console.warn('Download function can only run in browser environment')
    return
  }

  const link = document.createElement('a')
  link.download = `split-image-${index + 1}.${format}`
  link.href = URL.createObjectURL(splitImage.blob)
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up memory
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
  }, 100)
}

/**
 * Batch download images (ZIP format)
 */
export const downloadAllImages = async (
  splitImages: SplitImage[],
  format: string
) => {
  // Only run in browser environment
  if (!isBrowser) {
    throw new Error('This function can only run in browser environment')
  }

  // Import JSZip dynamically to avoid SSR issues
  const JSZip = (await import('jszip')).default
  
  const zip = new JSZip()
  
  // Add each split image to zip
  splitImages.forEach((splitImage, index) => {
    zip.file(`split-image-${index + 1}.${format}`, splitImage.blob)
  })
  
  // Generate zip file
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  
  // Download zip file
  const link = document.createElement('a')
  link.download = `split-images.zip`
  link.href = URL.createObjectURL(zipBlob)
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up memory
  setTimeout(() => {
    URL.revokeObjectURL(link.href)
  }, 100)
} 