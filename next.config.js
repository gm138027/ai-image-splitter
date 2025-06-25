/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config')

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n,
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // 允许未优化的图片，支持本地PNG文件
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
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // 优化包大小
  webpack: (config, { isServer }) => {
    // 只在客户端构建时优化包大小
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      }
    }
    return config
  },
}

module.exports = nextConfig 