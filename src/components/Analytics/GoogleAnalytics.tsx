import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/gtag'

const GoogleAnalytics: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // 延迟3秒加载GA，或用户交互后立即加载
    const timer = setTimeout(() => setShouldLoad(true), 3000)
    
    const handleInteraction = () => {
      setShouldLoad(true)
      clearTimeout(timer)
    }

    // 监听用户交互事件
    document.addEventListener('click', handleInteraction, { once: true })
    document.addEventListener('scroll', handleInteraction, { once: true })
    document.addEventListener('keydown', handleInteraction, { once: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('scroll', handleInteraction) 
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  if (!shouldLoad) return null

  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        onLoad={() => {
          console.log('Google Analytics loaded')
        }}
      />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics 