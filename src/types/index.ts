// Image splitting related type definitions
export interface SplitImage {
  id: string
  canvas: HTMLCanvasElement
  blob: Blob
}

export type SplitMode = 'vertical' | 'horizontal' | 'grid'
export type OutputFormat = 'jpg' | 'png' | 'webp' | 'bmp'

export interface SplitConfig {
  mode: SplitMode
  rows: number
  cols: number
  gridLineWidth: number
  outputFormat: OutputFormat
}

export interface ImageSplitterState {
  uploadedImage: HTMLImageElement | null
  splitImages: SplitImage[]
  isProcessing: boolean
  config: SplitConfig
}

// Component Props type definitions
export interface ImageUploaderProps {
  onFileUpload: (file: File) => void
  onDrop: (e: React.DragEvent) => void
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export interface SplitControlsProps {
  config: SplitConfig
  onConfigChange: (config: SplitConfig) => void
  onSplit: () => void
  onDownloadAll: () => void
  isProcessing: boolean
  hasSplitImages: boolean
}

export interface ImagePreviewProps {
  uploadedImage: HTMLImageElement | null
  splitImages: SplitImage[]
  config: SplitConfig
  onDownloadSingle: (splitImage: SplitImage, index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export interface HeroSectionProps {
  onFileUpload: (file: File) => void
  onDrop: (e: React.DragEvent) => void
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
} 