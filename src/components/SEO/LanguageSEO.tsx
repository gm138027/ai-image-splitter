import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

interface LanguageSEOProps {
  title?: string
  description?: string
  keywords?: string
}

/**
 * LanguageSEO Component - Multilingual page SEO optimization
 * 
 * Features:
 * 1. Generate unique title and description for each language version
 * 2. Add language-related robots directives
 * 3. Optimize Open Graph and Twitter Card tags
 * 4. Ensure each language version is recognized as an independent page
 */
const LanguageSEO: React.FC<LanguageSEOProps> = ({ 
  title, 
  description, 
  keywords 
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  
  // Get current language
  const getCurrentLocale = () => {
    if (router.query.lng && typeof router.query.lng === 'string') {
      return router.query.lng
    }
    return router.locale || 'en'
  }
  
  const currentLocale = getCurrentLocale()
  const baseUrl = 'https://aiimagesplitter.com'
  
  // Generate complete URL for current page
  const getCurrentUrl = () => {
    const cleanPath = router.pathname
    if (currentLocale === 'en') {
      return `${baseUrl}${cleanPath}`
    }
    return `${baseUrl}${cleanPath}?lng=${currentLocale}`
  }
  
  // Generate language-specific title
  const getLocalizedTitle = () => {
    if (title) return title
    return t('seo.title')
  }
  
  // Generate language-specific description
  const getLocalizedDescription = () => {
    if (description) return description
    return t('seo.description')
  }
  
  // Generate language-specific keywords
  const getLocalizedKeywords = () => {
    if (keywords) return keywords
    return t('seo.keywords')
  }
  
  // Language mapping - for Open Graph locale
  const localeMapping: Record<string, string> = {
    'en': 'en_US',
    'zh-CN': 'zh_CN',
    'id': 'id_ID',
    'pt': 'pt_PT',
    'fil': 'fil_PH',
    'ms': 'ms_MY',
    'hi': 'hi_IN',
    'vi': 'vi_VN',
    'kk': 'kk_KZ',
    'ru': 'ru_RU'
  }

  return (
    <Head>
      {/* Basic SEO tags - language specific */}
      <title>{getLocalizedTitle()}</title>
      <meta name="description" content={getLocalizedDescription()} />
      <meta name="keywords" content={getLocalizedKeywords()} />
      
      {/* Clear indication this is an indexable independent page */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Language declaration */}
      <meta httpEquiv="content-language" content={currentLocale} />
      <html lang={currentLocale} />
      
      {/* Open Graph tags - language specific */}
      <meta property="og:title" content={getLocalizedTitle()} />
      <meta property="og:description" content={getLocalizedDescription()} />
      <meta property="og:url" content={getCurrentUrl()} />
      <meta property="og:locale" content={localeMapping[currentLocale] || 'en_US'} />
      <meta property="og:site_name" content="AI Image Splitter" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${baseUrl}/images/penguin-split.png`} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={getLocalizedTitle()} />
      
      {/* Twitter Card tags - language specific */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={getLocalizedTitle()} />
      <meta name="twitter:description" content={getLocalizedDescription()} />
      <meta name="twitter:image" content={`${baseUrl}/images/penguin-split.png`} />
      <meta name="twitter:image:alt" content={getLocalizedTitle()} />
      
      {/* Additional language-related tags */}
      {currentLocale !== 'en' && (
        <>
          <meta name="geo.region" content={getRegionForLocale(currentLocale)} />
          <meta name="geo.placename" content={getPlaceForLocale(currentLocale)} />
        </>
      )}
    </Head>
  )
}

// Helper function: get region information based on language
const getRegionForLocale = (locale: string): string => {
  const regionMap: Record<string, string> = {
    'zh-CN': 'CN',
    'id': 'ID',
    'pt': 'PT',
    'fil': 'PH',
    'ms': 'MY',
    'hi': 'IN',
    'vi': 'VN',
    'kk': 'KZ',
    'ru': 'RU'
  }
  return regionMap[locale] || 'US'
}

const getPlaceForLocale = (locale: string): string => {
  const placeMap: Record<string, string> = {
    'zh-CN': 'China',
    'id': 'Indonesia',
    'pt': 'Portugal',
    'fil': 'Philippines',
    'ms': 'Malaysia',
    'hi': 'India',
    'vi': 'Vietnam',
    'kk': 'Kazakhstan',
    'ru': 'Russia'
  }
  return placeMap[locale] || 'United States'
}

export default LanguageSEO 