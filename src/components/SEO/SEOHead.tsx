/**
 * 统一SEO组件 - 合并原有的LanguageSEO、HreflangTags和简化的StructuredData
 * 
 * 简化原则：
 * 1. 保持核心SEO功能完整
 * 2. 减少重复代码和配置
 * 3. 合并相关功能到单一组件
 * 4. 保留最重要的结构化数据
 */

import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { usePageUrls } from '@/lib/urlUtils'
import { SEO_CONFIG, getOGLocale, type SupportedLocale } from '@/config/seo'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  includeStructuredData?: boolean
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  title, 
  description, 
  keywords,
  includeStructuredData = false
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { canonical, hreflang, currentUrl } = usePageUrls(router)
  
  // Get current language
  const currentLocale = (router.locale as SupportedLocale) || SEO_CONFIG.locales.default
  const baseUrl = SEO_CONFIG.domain
  
  // Generate localized content
  const localizedTitle = title || t('seo.title')
  const localizedDescription = description || t('seo.description')
  const localizedKeywords = keywords || t('seo.keywords')
  const ogLocale = getOGLocale(currentLocale)

  // 简化的结构化数据 - 只保留最重要的3种类型
  const getStructuredData = () => {
    if (!includeStructuredData) return null

    // 1. 组织信息 - 最重要，影响品牌展示
    const organizationData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "AI Image Splitter",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/android-chrome-512x512.png`,
        "width": 512,
        "height": 512
      },
      "description": t('structuredData.appDescription'),
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "url": baseUrl,
        "availableLanguage": ["en", "zh-CN", "vi", "ru", "pt", "ms", "kk", "id", "hi", "tl"]
      }
    }

    // 2. 网站信息 - 重要，影响搜索结果展示
    const websiteData = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": t('structuredData.websiteName'),
      "url": baseUrl,
      "publisher": {
        "@type": "Organization",
        "name": "AI Image Splitter",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/android-chrome-512x512.png`,
          "width": 512,
          "height": 512
        }
      }
    }

    // 3. 应用程序信息 - 重要，影响工具类网站的展示
    const applicationData = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": t('structuredData.appName'),
      "description": t('structuredData.appDescription'),
      "url": currentUrl,
      "applicationCategory": "MultimediaApplication",
      "isAccessibleForFree": true,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "author": {
        "@type": "Organization",
        "name": "AI Image Splitter",
        "url": baseUrl
      }
    }

    return [organizationData, websiteData, applicationData]
  }

  const structuredDataArray = getStructuredData()

  return (
    <Head>
      {/* 基础SEO标签 */}
      <title>{localizedTitle}</title>
      <meta name="description" content={localizedDescription} />
      <meta name="keywords" content={localizedKeywords} />
      
      {/* 搜索引擎指令 */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* 语言声明 */}
      <meta httpEquiv="content-language" content={currentLocale} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Hreflang标签 */}
      {hreflang.map(({ locale, url }) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={url}
        />
      ))}
      
      {/* Open Graph标签 */}
      <meta property="og:title" content={localizedTitle} />
      <meta property="og:description" content={localizedDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={SEO_CONFIG.site.name} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${baseUrl}/images/penguin-split.png`} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={localizedTitle} />
      
      {/* Twitter Card标签 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={localizedTitle} />
      <meta name="twitter:description" content={localizedDescription} />
      <meta name="twitter:image" content={`${baseUrl}/images/penguin-split.png`} />
      <meta name="twitter:image:alt" content={localizedTitle} />
      
      {/* 结构化数据 - 仅在需要时包含 */}
      {structuredDataArray && structuredDataArray.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  )
}

export default SEOHead
