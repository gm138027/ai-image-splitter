/**
 * Unified URL management utility
 * Resolves multilingual website URL generation inconsistencies
 */

// Supported language configuration - Single source of truth
export const SUPPORTED_LOCALES = [
  'en',       // English (default)
  'zh-CN',    // Simplified Chinese
  'id',       // Indonesian
  'pt',       // Portuguese
  'tl',       // Tagalog (Filipino) - Note: Use tl consistently, not fil
  'ms',       // Malay
  'hi',       // Hindi
  'vi',       // Vietnamese
  'kk',       // Kazakh
  'ru',       // Russian
] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// Base domain configuration
const BASE_URL = 'https://aiimagesplitter.com'

/**
 * URL Manager class - Unified URL generation logic
 */
export class URLManager {
  /**
   * Generate canonical URL
   */
  static getCanonicalUrl(pathname: string, locale: string): string {
    const cleanPath = this.cleanPath(pathname)
    
    if (locale === 'en') {
      return `${BASE_URL}${cleanPath}`
    }
    
    return `${BASE_URL}/${locale}${cleanPath}`
  }

  /**
   * Generate localized URL for specific language
   */
  static getLocalizedUrl(pathname: string, targetLocale: string): string {
    const cleanPath = this.cleanPath(pathname)
    
    if (targetLocale === 'en') {
      return `${BASE_URL}${cleanPath}`
    }
    
    return `${BASE_URL}/${targetLocale}${cleanPath}`
  }

  /**
   * Generate URL mapping for all language versions
   */
  static getAllLocalizedUrls(pathname: string): Record<string, string> {
    const urls: Record<string, string> = {}
    
    SUPPORTED_LOCALES.forEach(locale => {
      urls[locale] = this.getLocalizedUrl(pathname, locale)
    })
    
    return urls
  }

  /**
   * Clean path by removing language prefix and query parameters
   */
  private static cleanPath(pathname: string): string {
    // Remove query parameters
    const pathWithoutQuery = pathname.split('?')[0]
    
    // Remove language prefix
    const localePattern = new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(/|$)`)
    const cleanPath = pathWithoutQuery.replace(localePattern, '')
    
    // Ensure correct path format
    if (!cleanPath || cleanPath === '/') {
      return ''
    }
    
    return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  }

  /**
   * Validate if language code is supported
   */
  static isValidLocale(locale: string): locale is SupportedLocale {
    return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
  }

  /**
   * Extract language code from path
   */
  static extractLocaleFromPath(pathname: string): SupportedLocale | null {
    const match = pathname.match(new RegExp(`^/(${SUPPORTED_LOCALES.join('|')})(/|$)`))
    return match ? (match[1] as SupportedLocale) : null
  }

  /**
   * Generate hreflang mapping for SEO
   */
  static getHreflangMapping(pathname: string): Array<{ locale: string; url: string }> {
    const mapping: Array<{ locale: string; url: string }> = SUPPORTED_LOCALES.map(locale => ({
      locale,
      url: this.getLocalizedUrl(pathname, locale)
    }))

    // Add x-default
    mapping.push({
      locale: 'x-default',
      url: this.getLocalizedUrl(pathname, 'en')
    })

    return mapping
  }
}

/**
 * React Hook: Get current page URL information
 */
export const usePageUrls = (router: any) => {
  const { pathname, query, locale: renderedLocale } = router
  const lngParam = query.lng as string | undefined

  // The "effective" locale must prioritize the `lng` query parameter to fix legacy SEO issues.
  // If `lng` exists and is valid, use it. Otherwise, fall back to the locale of the rendered page.
  const effectiveLocale = (lngParam && URLManager.isValidLocale(lngParam))
    ? lngParam
    : renderedLocale || 'en'

  return {
    canonical: URLManager.getCanonicalUrl(pathname, effectiveLocale),
    alternates: URLManager.getAllLocalizedUrls(pathname),
    hreflang: URLManager.getHreflangMapping(pathname),
    currentUrl: URLManager.getCanonicalUrl(pathname, effectiveLocale)
  }
} 