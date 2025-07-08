// Google Analytics configuration and utility functions

export const GA_TRACKING_ID = 'G-TRZWPW2BJL'

// Google Analytics page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Google Analytics event tracking
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Common event tracking functions
export const trackImageUpload = () => {
  event({
    action: 'upload_image',
    category: 'engagement',
    label: 'image_uploaded'
  })
}

export const trackImageSplit = (splitMode: string) => {
  event({
    action: 'split_image',
    category: 'engagement',
    label: splitMode
  })
}

export const trackImageDownload = (downloadType: 'single' | 'batch') => {
  event({
    action: 'download_image',
    category: 'engagement',
    label: downloadType
  })
}

export const trackLanguageChange = (language: string) => {
  event({
    action: 'change_language',
    category: 'engagement',
    label: language
  })
}

export const trackNavigationClick = (destination: string) => {
  event({
    action: 'navigation_click',
    category: 'engagement',
    label: destination
  })
} 