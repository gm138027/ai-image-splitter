const path = require('path');

// 注意：由于这是在构建时运行的JS文件，我们需要直接定义配置以避免TS编译问题
// 但我们保持与 src/config/seo.ts 的一致性
// TODO: 考虑在未来版本中通过编译后的配置文件导入，确保100%一致性
const SUPPORTED_LOCALES = [
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
];

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: SUPPORTED_LOCALES,
  },
  localePath: path.join(process.cwd(), 'public', 'locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
} 