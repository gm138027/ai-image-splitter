import type { AppProps } from 'next/app'
import React from 'react'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import '@/styles/globals.css'

// 导入Google Analytics工具函数和组件
import { pageview } from '@/lib/gtag'
import dynamic from 'next/dynamic'

// 动态导入Google Analytics组件以减少初始bundle大小
const GoogleAnalytics = dynamic(() => import('@/components/Analytics/GoogleAnalytics'), {
  ssr: false,
})

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    console.error('ErrorBoundary caught error:', error)
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary error details:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>网站加载出现错误</h2>
          <p>错误信息: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            重新加载页面
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // 确保组件在客户端挂载后再渲染，避免水合错误
  useEffect(() => {
    console.log('App mounted on client side')
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      console.log('Route changed to:', url)
      pageview(url)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    router.events.on('hashChangeComplete', handleRouteChange)
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
      router.events.off('hashChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // 添加全局错误处理
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global JavaScript error:', event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // 在客户端挂载前显示加载状态，避免水合不匹配
  if (!mounted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>正在加载...</div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      {/* 优化后的Google Analytics组件 */}
      <GoogleAnalytics />
      
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default appWithTranslation(MyApp, nextI18NextConfig) 