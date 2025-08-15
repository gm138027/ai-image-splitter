import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES, SEO_CONFIG, normalizeLegacyLocale } from './config/seo'

/**
 * Next.js Middleware - URL重复问题解决方案
 * 
 * 功能：
 * 1. 将查询参数格式URL重定向到子路径格式
 * 2. 处理遗留语言代码重定向
 * 3. 确保URL一致性，解决"备用网页"问题
 * 4. 提供正确的canonical URL
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  // 1. 处理查询参数格式的语言切换 (?lng=xx)
  const lngParam = url.searchParams.get('lng')
  if (lngParam) {
    // 标准化遗留语言代码
    const normalizedLocale = normalizeLegacyLocale(lngParam)
    
    // 移除lng查询参数
    url.searchParams.delete('lng')
    
    // 构建正确的子路径格式URL
    if (normalizedLocale === SEO_CONFIG.locales.default) {
      // 默认语言不需要路径前缀
      url.pathname = pathname
    } else {
      // 非默认语言使用子路径格式
      url.pathname = `/${normalizedLocale}${pathname}`
    }
    
    console.log(`🔄 Redirecting query param URL: ${request.url} → ${url.toString()}`)
    return NextResponse.redirect(url, 301) // 永久重定向
  }

  // 2. 处理遗留语言代码路径 (/fil → /tl)
  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    
    // 检查是否是遗留语言代码
    if (firstSegment === 'fil') {
      // 重定向 /fil 到 /tl
      url.pathname = pathname.replace('/fil', '/tl')
      console.log(`🔄 Redirecting legacy locale: ${request.url} → ${url.toString()}`)
      return NextResponse.redirect(url, 301) // 永久重定向
    }
    
    // 检查是否是无效的语言代码
    if (firstSegment.length === 2 || firstSegment.includes('-')) {
      // 可能是语言代码，验证是否有效
      if (!SUPPORTED_LOCALES.includes(firstSegment as any)) {
        // 无效语言代码，重定向到默认语言
        const restPath = pathSegments.slice(1).join('/')
        url.pathname = restPath ? `/${restPath}` : '/'
        console.log(`🔄 Redirecting invalid locale: ${request.url} → ${url.toString()}`)
        return NextResponse.redirect(url, 301)
      }
    }
  }

  // 3. 处理尾部斜杠一致性
  if (pathname !== '/' && pathname.endsWith('/')) {
    url.pathname = pathname.slice(0, -1)
    console.log(`🔄 Removing trailing slash: ${request.url} → ${url.toString()}`)
    return NextResponse.redirect(url, 301)
  }

  // 4. 添加安全头和SEO头
  const response = NextResponse.next()
  
  // 添加安全头
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // 添加缓存头（对于静态资源）
  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/images/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

// 配置中间件匹配规则
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - api 路由
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico
     * - 其他静态资源
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
}
