/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config.js');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: false,
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
  // 优化生产构建
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // 生产环境移除console.log
  },
  // 简化代码分割配置 - 减少网络请求
  webpack: (config, { isServer }) => {
    // 只在客户端构建时进行基础优化
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
  // 处理图片和静态资源
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}

module.exports = nextConfig 