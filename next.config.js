/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  images: {
    // 启用自动图片优化，支持WebP和AVIF格式
    formats: ['image/webp', 'image/avif'],
    domains: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1年缓存
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 确保静态文件可以被正确服务
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
    ]
  },
  experimental: {
    optimizeCss: true,
  },
  // 优化生产构建 - 但保留 console.log 用于调试
  compiler: {
    removeConsole: false, // 暂时保留 console.log 用于生产环境调试
  },
  // 保持原有的代码分割配置
  webpack: (config, { isServer }) => {
    // 只在客户端构建时优化包大小
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
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
            enforce: true,
            maxSize: 200000, // 限制vendor chunk大小
          },
          // 分离React相关
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
          // 分离图标库
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react)[\\/]/,
            name: 'icons',
            priority: 15,
            chunks: 'all',
          },
          // 分离i18n相关
          i18n: {
            test: /[\\/]node_modules[\\/](next-i18next|react-i18next|i18next)[\\/]/,
            name: 'i18n',
            priority: 15,
            chunks: 'all',
          },
        },
      }
    }
    return config
  },
  // 添加输出配置，确保静态导出正确
  trailingSlash: true,
  // 处理图片和静态资源
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig 