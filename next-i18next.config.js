module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en',       // 英语（主语言）
      'zh-CN',    // 简体中文
      'id',       // 印尼语
      'pt',       // 葡萄牙语
      'fil',      // 菲律宾语
      'ms',       // 马来语
      'hi',       // 印地语
      'vi',       // 越南语
      'kk',       // 哈萨克语
      'ru',       // 俄语
    ],
  },
  localePath: './public/locales',
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