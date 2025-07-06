import Head from 'next/head'
import { useRouter } from 'next/router'

interface HreflangTagsProps {
  baseUrl?: string
}

/**
 * HreflangTags Component - Solves the "alternate page" issue for multilingual websites
 * 
 * Features:
 * 1. Dynamically generates hreflang tags for all language versions of the current page
 * 2. Includes x-default tag pointing to the default language version
 * 3. Fixes canonical tags to include language information
 * 4. Tells search engines these pages are equivalent multilingual versions, not alternate pages
 */
const HreflangTags: React.FC<HreflangTagsProps> = ({ baseUrl = 'https://aiimagesplitter.com' }) => {
  const router = useRouter()
  
  // Supported language configuration
  const locales = [
    'en',       // English (default)
    'zh-CN',    // Simplified Chinese
    'id',       // Indonesian
    'pt',       // Portuguese
    'tl',       // Tagalog (Filipino)
    'ms',       // Malay
    'hi',       // Hindi
    'vi',       // Vietnamese
    'kk',       // Kazakh
    'ru',       // Russian
  ]
  
  // Get clean path (excluding any query parameters)
  const cleanPath = router.pathname
  
  // Get current language (from query parameters or router.locale)
  const getCurrentLocale = () => {
    // Priority: get language from URL parameters
    if (router.query.lng && typeof router.query.lng === 'string') {
      return router.query.lng
    }
    // Fallback: get from router.locale
    if (router.locale) {
      return router.locale
    }
    // Default: return English
    return 'en'
  }
  
  // 获取当前页面的路径（去除语言前缀）
  const getPathWithoutLocale = () => {
    // 以 /zh-CN/blog、/tl/privacy、/blog 形式处理
    const path = router.asPath.split('?')[0]
    const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`, 'i')
    return path.replace(localePattern, '/')
  }
  
  // 生成每种语言的完整 URL，指向同一路径的多语言版本
  const getLocalizedUrl = (locale: string) => {
    const path = getPathWithoutLocale()
    if (locale === 'en') {
      return `${baseUrl}${path === '/' ? '' : path}`
    } else {
      return `${baseUrl}/${locale}${path === '/' ? '' : path}`
    }
  }
  
  // Get canonical URL for current page
  const getCanonicalUrl = () => {
    const currentLocale = getCurrentLocale()
    if (currentLocale === 'en') {
      return `${baseUrl}`
    }
    return `${baseUrl}/${currentLocale}`
  }

  return (
    <Head>
      {/* Canonical URL - points to current language version, removes other query parameters */}
      <link rel="canonical" href={getCanonicalUrl()} />
      
      {/* Hreflang tags - tell search engines these are equivalent multilingual versions */}
      {locales.map((locale) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={getLocalizedUrl(locale)}
        />
      ))}
      
      {/* x-default tag - points to default language version */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={getLocalizedUrl('en')}
      />
    </Head>
  )
}

export default HreflangTags 