import type { SplitImage, SplitConfig } from '@/types'

/**
 * Check if we're running in browser environment
 */
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined'

const SUPPORTED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/png',
  'image/x-png',
  'image/webp'
])

export const SUPPORTED_IMAGE_INPUT_ACCEPT = '.jpg,.jpeg,.png,.webp'

const getCanvasMimeType = (format: SplitConfig['outputFormat']) => {
  if (format === 'jpg') {
    return 'image/jpeg'
  }
  return `image/${format}`
}

type GridShape = {
  rowCount: number
  colCount: number
}

type AxisSegment = {
  sourceStart: number
  sourceSize: number
  outputSize: number
}

const getGridShape = (config: SplitConfig): GridShape => {
  switch (config.mode) {
    case 'vertical':
      return { rowCount: 1, colCount: config.cols }
    case 'horizontal':
      return { rowCount: config.rows, colCount: 1 }
    case 'grid':
    default:
      return { rowCount: config.rows, colCount: config.cols }
  }
}

const createAxisSegments = (length: number, count: number): AxisSegment[] => {
  const safeCount = Math.max(1, Math.floor(count))
  const sourceLength = Math.max(1, length)
  const outputLength = Math.max(safeCount, Math.round(sourceLength))
  const segments: AxisSegment[] = []

  let previousOutputEnd = 0

  for (let index = 0; index < safeCount; index++) {
    const sourceStart = (sourceLength * index) / safeCount
    const sourceEnd = (sourceLength * (index + 1)) / safeCount
    const outputEnd = Math.round((outputLength * (index + 1)) / safeCount)

    segments.push({
      sourceStart,
      sourceSize: sourceEnd - sourceStart,
      outputSize: Math.max(1, outputEnd - previousOutputEnd)
    })

    previousOutputEnd = outputEnd
  }

  return segments
}

const getSliceIndices = (index: number, config: SplitConfig, colCount: number) => {
  if (config.mode === 'vertical') {
    return { rowIndex: 0, colIndex: index }
  }

  if (config.mode === 'horizontal') {
    return { rowIndex: index, colIndex: 0 }
  }

  return {
    rowIndex: Math.floor(index / colCount),
    colIndex: index % colCount
  }
}

/**
 * Validate if file is a valid image file
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const normalizedFileType = (file.type || '').toLowerCase()

  // Check file type
  if (!SUPPORTED_UPLOAD_MIME_TYPES.has(normalizedFileType)) {
    return { isValid: false, error: 'invalidFileType' }
  }
  
  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024 // 50MB
  if (file.size > maxSize) {
    return { isValid: false, error: 'fileTooLarge' }
  }
  
  return { isValid: true }
}

/**
 * Create image object from file
 */
export const createImageFromFile = (
  file: File
): Promise<{ image: HTMLImageElement; objectUrl: string }> => {
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
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      // Check image dimensions (max 8192x8192)
      const maxDimension = 8192
      if (img.width > maxDimension || img.height > maxDimension) {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('imageTooLarge'))
        return
      }
      resolve({ image: img, objectUrl })
    }
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Failed to load image'))
    }
    img.src = objectUrl
  })
}

/**
 * Calculate split parameters
 */
export const calculateSplitParams = (
  image: HTMLImageElement,
  config: SplitConfig
) => {
  const { rowCount, colCount } = getGridShape(config)
  const { width: imgWidth, height: imgHeight, offsetX, offsetY } = getEffectiveDimensions(
    image.width,
    image.height,
    config.cropRegion
  )

  const splitCount = rowCount * colCount
  const splitWidth = imgWidth / colCount
  const splitHeight = imgHeight / rowCount

  return { splitCount, splitWidth, splitHeight, offsetX, offsetY }
}

/**
 * Create split image
 */
export const createSplitImage = async (
  sourceImage: HTMLImageElement,
  index: number,
  config: SplitConfig
): Promise<SplitImage> => {
  // Only run in browser environment
  if (!isBrowser) {
    throw new Error('This function can only run in browser environment')
  }

  const { width: effectiveWidth, height: effectiveHeight, offsetX, offsetY } = getEffectiveDimensions(
    sourceImage.width,
    sourceImage.height,
    config.cropRegion
  )
  const { rowCount, colCount } = getGridShape(config)
  const { rowIndex, colIndex } = getSliceIndices(index, config, colCount)
  const xSegment = createAxisSegments(effectiveWidth, colCount)[colIndex]
  const ySegment = createAxisSegments(effectiveHeight, rowCount)[rowIndex]
  if (!xSegment || !ySegment) {
    throw new Error('Failed to calculate split segment')
  }

  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = xSegment.outputSize
  tempCanvas.height = ySegment.outputSize
  const tempCtx = tempCanvas.getContext('2d')!

  // Draw image
  tempCtx.drawImage(
    sourceImage,
    offsetX + xSegment.sourceStart,
    offsetY + ySegment.sourceStart,
    xSegment.sourceSize,
    ySegment.sourceSize,
    0,
    0,
    xSegment.outputSize,
    ySegment.outputSize
  )

  // Convert to Blob
  const blob = await new Promise<Blob>((resolve) => {
    tempCanvas.toBlob((blob) => resolve(blob!), getCanvasMimeType(config.outputFormat))
  })

  return {
    id: `split-${index}`,
    blob,
    objectUrl: URL.createObjectURL(blob),
    width: tempCanvas.width,
    height: tempCanvas.height
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

  const { splitCount } = calculateSplitParams(
    sourceImage,
    config
  )
  const splitImages: SplitImage[] = []

  for (let i = 0; i < splitCount; i++) {
    const splitImg = await createSplitImage(
      sourceImage,
      i,
      config
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

const getEffectiveDimensions = (
  imageWidth: number,
  imageHeight: number,
  cropRegion: SplitConfig['cropRegion']
) => {
  if (!cropRegion) {
    return {
      width: imageWidth,
      height: imageHeight,
      offsetX: 0,
      offsetY: 0
    }
  }

  return {
    width: cropRegion.width,
    height: cropRegion.height,
    offsetX: cropRegion.x,
    offsetY: cropRegion.y
  }
}
