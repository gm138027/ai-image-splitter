/**
 * 统一SEO配置管理中心
 * 单一数据源，避免配置分散和不一致问题
 */

// 支持的语言配置 - 单一数据源
export const SUPPORTED_LOCALES = [
  'en',       // English (default)
  'zh-CN',    // Simplified Chinese
  'id',       // Indonesian
  'pt',       // Portuguese
  'tl',       // Tagalog (Filipino) - 注意：使用tl而不是fil
  'ms',       // Malay
  'hi',       // Hindi
  'vi',       // Vietnamese
  'kk',       // Kazakh
  'ru',       // Russian
] as const

export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

// 语言显示名称映射
export const LOCALE_NAMES: Record<SupportedLocale, { name: string; nativeName: string; flag: string }> = {
  'en': { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  'zh-CN': { name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  'pt': { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  'tl': { name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  'ms': { name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  'hi': { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  'vi': { name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  'kk': { name: 'Kazakh', nativeName: 'Қазақша', flag: '🇰🇿' },
  'ru': { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
}

// Open Graph locale映射
export const OG_LOCALE_MAPPING: Record<SupportedLocale, string> = {
  'en': 'en_US',
  'zh-CN': 'zh_CN',
  'id': 'id_ID',
  'pt': 'pt_PT',
  'tl': 'tl_PH',
  'ms': 'ms_MY',
  'hi': 'hi_IN',
  'vi': 'vi_VN',
  'kk': 'kk_KZ',
  'ru': 'ru_RU'
}

// 地区信息映射
export const REGION_MAPPING: Record<SupportedLocale, { region: string; place: string }> = {
  'en': { region: 'US', place: 'United States' },
  'zh-CN': { region: 'CN', place: 'China' },
  'id': { region: 'ID', place: 'Indonesia' },
  'pt': { region: 'PT', place: 'Portugal' },
  'tl': { region: 'PH', place: 'Philippines' },
  'ms': { region: 'MY', place: 'Malaysia' },
  'hi': { region: 'IN', place: 'India' },
  'vi': { region: 'VN', place: 'Vietnam' },
  'kk': { region: 'KZ', place: 'Kazakhstan' },
  'ru': { region: 'RU', place: 'Russia' },
}

// SEO基础配置
export const SEO_CONFIG = {
  // 域名配置
  domain: process.env.NEXT_PUBLIC_DOMAIN || 'https://aiimagesplitter.com',
  
  // 语言配置
  locales: {
    supported: SUPPORTED_LOCALES,
    default: 'en' as SupportedLocale,
    names: LOCALE_NAMES,
    ogMapping: OG_LOCALE_MAPPING,
    regionMapping: REGION_MAPPING
  },
  
  // 分析工具配置
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID || 'G-TRZWPW2BJL'
  },
  
  // 站点基础信息
  site: {
    name: 'AI Image Splitter',
    description: 'Free Online Image Splitter & Instagram Grid Maker',
    keywords: 'image splitter, instagram grid maker, social media tools',
    author: 'AI Image Splitter',
    logo: '/android-chrome-512x512.png',
    favicon: '/favicon.ico'
  },
  
  // sitemap配置
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

// 工具函数：验证语言代码
export const isValidLocale = (locale: string): locale is SupportedLocale => {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

// 工具函数：获取语言显示信息
export const getLocaleInfo = (locale: SupportedLocale) => {
  return LOCALE_NAMES[locale]
}

// 工具函数：获取Open Graph locale
export const getOGLocale = (locale: SupportedLocale): string => {
  return OG_LOCALE_MAPPING[locale]
}

// 工具函数：获取地区信息
export const getRegionInfo = (locale: SupportedLocale) => {
  return REGION_MAPPING[locale]
}

// 工具函数：处理遗留语言代码
export const normalizeLegacyLocale = (locale: string): SupportedLocale => {
  // 处理已知的遗留别名
  const legacyMapping: Record<string, SupportedLocale> = {
    'fil': 'tl', // Filipino的遗留代码
  }

  const normalized = legacyMapping[locale] || locale

  if (isValidLocale(normalized)) {
    return normalized
  }

  // 如果无法识别，返回默认语言
  return SEO_CONFIG.locales.default
}

export default SEO_CONFIG
