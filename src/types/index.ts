/* eslint-disable no-unused-vars */

// Image splitting related type definitions
export interface SplitImage {
  id: string
  blob: Blob
  objectUrl: string
  width: number
  height: number
}

export type SplitMode = 'vertical' | 'horizontal' | 'grid'
export const OUTPUT_FORMATS = ['jpg', 'png', 'webp'] as const
export type OutputFormat = (typeof OUTPUT_FORMATS)[number]

export type AspectRatioOption = 'default' | '4:5' | '3:4' | '1:1'

export interface CropRegion {
  x: number
  y: number
  width: number
  height: number
}

export interface SplitConfig {
  mode: SplitMode
  rows: number
  cols: number
  gridLineWidth: number
  outputFormat: OutputFormat
  aspectRatio: AspectRatioOption
  cropRegion: CropRegion | null
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
  cropRegion: CropRegion | null
  cropAspectRatioValue: number | null
  shouldShowCrop: boolean
  onCropRegionCommit: (region: CropRegion | null) => void
  previewRows: number
  previewCols: number
  onDownloadSingle: (splitImage: SplitImage, index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}

export interface HeroSectionProps {
  onDrop: (e: React.DragEvent) => void
  onFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement>
}
