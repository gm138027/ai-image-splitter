import Head from 'next/head'
import { useRouter } from 'next/router'
import { URLManager, usePageUrls } from '@/lib/urlUtils'

interface HreflangTagsProps {
  baseUrl?: string // Keep for compatibility, but no longer used
}

/**
 * HreflangTags Component - Uses unified URL management system
 * 
 * Features:
 * 1. Unified URL generation logic, eliminates inconsistencies
 * 2. Auto-generates hreflang tags for all language versions
 * 3. Correct canonical tag configuration
 * 4. Fully compliant with Google SEO best practices
 */
const HreflangTags: React.FC<HreflangTagsProps> = () => {
  const router = useRouter()
  const { canonical, hreflang } = usePageUrls(router)

  return (
    <Head>
      {/* Canonical URL - Uses unified URL management */}
      <link rel="canonical" href={canonical} />
      
      {/* Hreflang tags - Uses unified generated mapping */}
      {hreflang.map(({ locale, url }) => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={locale}
          href={url}
        />
      ))}
    </Head>
  )
}

export default HreflangTags 