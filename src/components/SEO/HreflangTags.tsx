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
  
  // Get current language (只用router.locale，不再检测query.lng)
  const getCurrentLocale = () => {
    return router.locale || 'en'
  }
  
  // 获取当前页面的路径（去除语言前缀，保留 slug 和子路径）
  const getPathWithoutLocale = () => {
    // 以 /zh-CN/blog/xxx、/tl/privacy、/blog/xxx 形式处理
    const path = router.asPath.split('?')[0]
    const localePattern = new RegExp(`^/(${locales.join('|')})(/|$)`, 'i')
    const clean = path.replace(localePattern, '')
    // 保证首页为 ''，其它为 '/xxx'
    return clean === '' || clean === '/' ? '' : clean
  }
  
  // 生成每种语言的完整 URL，指向同一路径的多语言版本（不带末尾斜杠）
  const getLocalizedUrl = (locale: string) => {
    const path = getPathWithoutLocale()
    if (locale === 'en') {
      return `${baseUrl}${path}`
    } else {
      return `${baseUrl}/${locale}${path}`
    }
  }
  
  // Get canonical URL for current page（不带末尾斜杠）
  const getCanonicalUrl = () => {
    if (router.pathname === '/' && router.locale && router.locale !== 'en') {
      return `${baseUrl}/${router.locale}`
    }
    if (router.pathname === '/') {
      return baseUrl
    }
    return `${baseUrl}${router.locale === 'en' ? '' : '/' + router.locale}${router.pathname}`
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