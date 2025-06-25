import React, { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  decoding = 'async',
  style,
  onLoad,
  onError
}) => {
  const [webpError, setWebpError] = useState(false)

  // 生成WebP版本的路径
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')
  
  const handleWebpError = () => {
    setWebpError(true)
  }

  const handleImageError = () => {
    onError?.()
  }

  const handleImageLoad = () => {
    onLoad?.()
  }

  // 如果WebP加载失败，使用原格式
  const finalSrc = webpError ? src : webpSrc

  return (
    <picture>
      {/* WebP format for modern browsers */}
      {!webpError && (
        <source 
          srcSet={webpSrc} 
          type="image/webp" 
          onError={handleWebpError}
        />
      )}
      
      {/* Fallback image */}
      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        className={className}
        style={style}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    </picture>
  )
}

export default OptimizedImage 