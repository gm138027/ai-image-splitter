import type { AppProps } from 'next/app'
import React from 'react'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import '@/styles/globals.css'

// 导入Google Analytics工具函数和组件
import { pageview } from '@/lib/gtag'
import dynamic from 'next/dynamic'

// 动态导入Google Analytics组件以减少初始bundle大小
const GoogleAnalytics = dynamic(() => import('@/components/Analytics/GoogleAnalytics'), {
  ssr: false,
})

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught error:', error)
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary error details:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Website Loading Error</h2>
          <p>Error message: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Optimization: remove unnecessary route listeners and console.log
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // 自动跳转参数式URL到路径式URL（不带末尾斜杠）
  React.useEffect(() => {
    if (router.query.lng && router.query.lng !== router.locale) {
      const cleanPath = router.asPath.replace(/\?.*$/, '')
      router.replace(`/${router.query.lng}${cleanPath === '/' ? '' : cleanPath}`)
    }
  }, [router.query.lng, router.locale])

  return (
    <ErrorBoundary>
              {/* Optimized Google Analytics component */}
      <GoogleAnalytics />
      
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default appWithTranslation(MyApp, nextI18NextConfig) 