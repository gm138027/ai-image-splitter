/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js')
const localeConfig = require('./config/locales.json')

const DEFAULT_LOCALE = localeConfig.defaultLocale || 'en'
const LEGACY_LOCALE_REDIRECTS = localeConfig.legacyLocaleRedirects || {}

const getLocaleDestination = (targetLocale, withPath) => {
  if (targetLocale === DEFAULT_LOCALE) {
    return withPath ? '/:path+' : '/'
  }

  return withPath ? `/${targetLocale}/:path+` : `/${targetLocale}`
}

const buildLegacyLocaleRedirectRules = () => {
  return Object.entries(LEGACY_LOCALE_REDIRECTS).flatMap(([sourceLocale, targetLocale]) => {
    const source = String(sourceLocale || '').toLowerCase()
    const target = String(targetLocale || '')

    if (!source || !target || source === target.toLowerCase()) {
      return []
    }

    return [
      {
        source: `/${source}`,
        destination: getLocaleDestination(target, false),
        permanent: true,
      },
      {
        source: `/${source}/:path+`,
        destination: getLocaleDestination(target, true),
        permanent: true,
      },
    ]
  })
}

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  i18n,
  images: {
    formats: ['image/webp', 'image/avif'],
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return buildLegacyLocaleRedirectRules()
  },
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig
