import localeConfigJson from '../../config/locales.json'

// Locale configuration from shared JSON.
const localeConfig = localeConfigJson as {
  defaultLocale: string
  locales: readonly string[]
}

export const SUPPORTED_LOCALES = localeConfig.locales
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

// Display names for supported locales.
export const LOCALE_NAMES: Record<SupportedLocale, { name: string; nativeName: string; flag: string }> = {
  'en': { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  'zh-CN': { name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'vi': { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  'ru': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
}

// Open Graph locale mapping.
export const OG_LOCALE_MAPPING: Record<SupportedLocale, string> = {
  'en': 'en_US',
  'zh-CN': 'zh_CN',
  'id': 'id_ID',
  'pt': 'pt_PT',
  'vi': 'vi_VN',
  'ru': 'ru_RU'
}

// Region mapping.
export const REGION_MAPPING: Record<SupportedLocale, { region: string; place: string }> = {
  'en': { region: 'US', place: 'United States' },
  'zh-CN': { region: 'CN', place: 'China' },
  'id': { region: 'ID', place: 'Indonesia' },
  'pt': { region: 'PT', place: 'Portugal' },
  'vi': { region: 'VN', place: 'Vietnam' },
  'ru': { region: 'RU', place: 'Russia' },
}

// Base SEO configuration.
export const SEO_CONFIG = {
  domain:
    process.env.NEXT_PUBLIC_DOMAIN ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://aiimagesplitter.com',
  
  locales: {
    supported: SUPPORTED_LOCALES,
    default: (localeConfig.defaultLocale as SupportedLocale) || 'en',
    names: LOCALE_NAMES,
    ogMapping: OG_LOCALE_MAPPING,
    regionMapping: REGION_MAPPING
  },
  
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || 'G-TRZWPW2BJL'
  },
  
  site: {
    name: 'AI Image Splitter',
    description: 'Free Online Image Splitter & Instagram Grid Maker',
    keywords: 'image splitter, instagram grid maker, social media tools',
    author: 'AI Image Splitter',
    logo: '/android-chrome-512x512.png',
    favicon: '/favicon.ico'
  },
  
  sitemap: {
    changefreq: {
      homepage: 'daily' as const,
      mainPages: 'weekly' as const,
      staticPages: 'monthly' as const
    },
    priority: {
      homepage: '1.0',
      mainPages: '0.8',
      staticPages: '0.8'
    }
  }
} as const

// Helpers: validate locale.
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

// Helpers: get locale display info.
export const getLocaleInfo = (locale: SupportedLocale) => {
  return LOCALE_NAMES[locale]
}

// Helpers: get Open Graph locale.
export const getOGLocale = (locale: SupportedLocale): string => {
  return OG_LOCALE_MAPPING[locale]
}

// Helpers: get region info.
export const getRegionInfo = (locale: SupportedLocale) => {
  return REGION_MAPPING[locale]
}

// Helpers: normalize legacy locale codes.
export const normalizeLegacyLocale = (locale: string): SupportedLocale => {
  const legacyMapping: Record<string, SupportedLocale> = {
    'fil': SEO_CONFIG.locales.default, // Legacy Filipino code.
  }

  const normalized = legacyMapping[locale] || locale

  if (isValidLocale(normalized)) {
    return normalized
  }

  return SEO_CONFIG.locales.default
}

export default SEO_CONFIG


