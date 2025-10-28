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
  ogType?: string
  ogImagePath?: string
  robots?: string
  twitterCard?: string
}

const DEFAULT_ROBOTS = 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
const DEFAULT_OG_IMAGE = '/images/penguin-split.png'
const DEFAULT_OG_TYPE = 'website'
const DEFAULT_TWITTER_CARD = 'summary_large_image'

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  includeStructuredData = false,
  ogType = DEFAULT_OG_TYPE,
  ogImagePath,
  robots = DEFAULT_ROBOTS,
  twitterCard = DEFAULT_TWITTER_CARD
}) => {
  const router = useRouter()
  const { t } = useTranslation('common')
  const { canonical, hreflang, currentUrl } = usePageUrls(router)

  const currentLocale = (router.locale as SupportedLocale) || SEO_CONFIG.locales.default
  const baseUrl = SEO_CONFIG.domain

  const localizedTitle = title || t('seo.title')
  const localizedDescription = description || t('seo.description')
  const localizedKeywords = keywords || t('seo.keywords')
  const ogLocale = getOGLocale(currentLocale)
  const ogImage = ogImagePath
    ? (ogImagePath.startsWith('http') ? ogImagePath : `${baseUrl}${ogImagePath}`)
    : `${baseUrl}${DEFAULT_OG_IMAGE}`

  const getStructuredData = () => {
    if (!includeStructuredData) return null

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

    return [organizationData, websiteData]
  }

  const structuredDataArray = getStructuredData()

  return (
    <Head>
      <title>{localizedTitle}</title>
      <meta name="description" content={localizedDescription} />
      <meta name="keywords" content={localizedKeywords} />

      <meta name="robots" content={robots} />
      <meta name="googlebot" content={robots} />

      <meta httpEquiv="content-language" content={currentLocale} />

      <link rel="canonical" href={canonical} />

      {hreflang.map(({ locale, url }) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={url}
        />
      ))}

      <meta property="og:title" content={localizedTitle} />
      <meta property="og:description" content={localizedDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={SEO_CONFIG.site.name} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="600" />
      <meta property="og:image:height" content="400" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:alt" content={localizedTitle} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={localizedTitle} />
      <meta name="twitter:description" content={localizedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={localizedTitle} />

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
