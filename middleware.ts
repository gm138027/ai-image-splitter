import { NextRequest, NextResponse } from 'next/server'

// 支持的语言前缀
const locales = ['en', 'zh-CN', 'id', 'pt', 'tl', 'ms', 'hi', 'vi', 'kk', 'ru']

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // 1. 处理 ?lng=xxx 兼容入口
  const lngParam = searchParams.get('lng')
  if (lngParam && locales.includes(lngParam)) {
    // 跳转到 /xxx
    return NextResponse.redirect(new URL(`/${lngParam}`, request.url), 301)
  }

  // 2. 处理多重前缀（如 /zh-CN/hi、/en/fil）
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length >= 2 && locales.includes(pathParts[0]) && locales.includes(pathParts[1])) {
    // 只保留最后一个前缀
    return NextResponse.redirect(new URL(`/${pathParts[1]}`, request.url), 301)
  }

  // 3. 其它情况不处理，正常放行
  return NextResponse.next()
}

// 只拦截所有页面请求
export const config = {
  matcher: '/:path*',
} 