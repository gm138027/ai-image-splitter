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
  // URL重定向规则 - 解决URL重复问题
  async redirects() {
    return [
      // 1. 重定向遗留语言代码
      {
        source: '/fil/:path*',
        destination: '/tl/:path*',
        permanent: true, // 301重定向
      },
      // 2. 重定向其他可能的遗留格式
      {
        source: '/filipino/:path*',
        destination: '/tl/:path*',
        permanent: true,
      },
      // 3. 处理常见的错误语言代码
      {
        source: '/cn/:path*',
        destination: '/zh-CN/:path*',
        permanent: true,
      },
      {
        source: '/zh/:path*',
        destination: '/zh-CN/:path*',
        permanent: true,
      },
      // 4. 重定向带有查询参数的URL到正确格式
      // 注意：这些将由middleware处理，这里作为备用
    ]
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
      // 添加安全头
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