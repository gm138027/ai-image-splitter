import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { GA_TRACKING_ID } from '@/lib/gtag'

const GoogleAnalytics: React.FC = () => {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    // 延迟5秒加载GA，优先保证页面渲染性能
    const timer = setTimeout(() => setShouldLoad(true), 5000)
    
    const handleInteraction = () => {
      setShouldLoad(true)
      clearTimeout(timer)
    }

    // 延迟添加事件监听器，避免初始渲染阻塞
    const addListeners = () => {
      document.addEventListener('click', handleInteraction, { once: true })
      document.addEventListener('scroll', handleInteraction, { once: true })
      document.addEventListener('keydown', handleInteraction, { once: true })
    }
    
    // 1秒后再添加事件监听器
    const listenerTimer = setTimeout(addListeners, 1000)

    return () => {
      clearTimeout(timer)
      clearTimeout(listenerTimer)
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