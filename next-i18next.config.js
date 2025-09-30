const path = require('path')
const localeConfig = require('./config/locales.json')

module.exports = {
  i18n: {
    defaultLocale: localeConfig.defaultLocale || 'en',
    locales: localeConfig.locales,
  },
  localePath: path.join(process.cwd(), 'public', 'locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  fallbackLng: localeConfig.defaultLocale || 'en',
  debug: process.env.NODE_ENV === 'development',
  saveMissing: false,
  strictMode: true,
  serializeConfig: false,
  react: {
    useSuspense: false,
  },
}
