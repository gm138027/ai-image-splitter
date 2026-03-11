/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
  i18n,
  images: {
    // 鍚敤鑷姩鍥剧墖浼樺寲锛屾敮鎸乄ebP鍜孉VIF鏍煎紡
    formats: ['image/webp', 'image/avif'],
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1骞寸紦瀛?
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // URL閲嶅畾鍚戣鍒?- 瑙ｅ喅URL閲嶅闂
  async redirects() {
    return [
      {
        source: '/cn',
        destination: '/zh-CN',
        permanent: true,
      },
      {
        source: '/cn/:path+',
        destination: '/zh-CN/:path+',
        permanent: true,
      },
      {
        source: '/zh',
        destination: '/zh-CN',
        permanent: true,
      },
      {
        source: '/zh/:path+',
        destination: '/zh-CN/:path+',
        permanent: true,
      },
    ]
  },

  // 纭繚闈欐€佹枃浠跺彲浠ヨ姝ｇ‘鏈嶅姟
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
      // 娣诲姞瀹夊叏澶?
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
  // 浼樺寲鐢熶骇鏋勫缓
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 鐢熶骇鐜绉婚櫎console.log
  },
  // 绠€鍖栦唬鐮佸垎鍓查厤缃?- 鍑忓皯缃戠粶璇锋眰
  webpack: (config, { isServer }) => {
    // 鍙湪瀹㈡埛绔瀯寤烘椂杩涜鍩虹浼樺寲
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
  // 澶勭悊鍥剧墖鍜岄潤鎬佽祫婧?  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig 
