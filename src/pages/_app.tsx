import type { AppProps } from 'next/app'
import React from 'react'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import nextI18NextConfig from '../../next-i18next.config.js'
import '@/styles/globals.css'

// Import Google Analytics utility functions and components
import { pageview } from '@/lib/gtag'
import dynamic from 'next/dynamic'

// Dynamically import Google Analytics component to reduce initial bundle size
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

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <ErrorBoundary>
      {/* Optimized Google Analytics component */}
      <GoogleAnalytics />

      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default appWithTranslation(MyApp, nextI18NextConfig)