import { NextRequest, NextResponse } from 'next/server'

// 只允许的语言前缀
const locales = ['en', 'zh-CN', 'id', 'pt', 'tl', 'ms', 'hi', 'vi', 'kk', 'ru']

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // 只要有?lng=xxx参数，且xxx是受支持的语言，强制跳转到/xxx
  const lngParam = searchParams.get('lng')
  if (lngParam && locales.includes(lngParam)) {
    // 不管当前路径是什么，全部跳转到 /xxx
    return NextResponse.redirect(new URL(`/${lngParam}`, request.url), 301)
  }

  // 处理多重前缀（如 /zh-CN/hi、/en/pt），只保留最后一个前缀
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length >= 2 && locales.includes(pathParts[0]) && locales.includes(pathParts[1])) {
    return NextResponse.redirect(new URL(`/${pathParts[1]}`, request.url), 301)
  }

  return NextResponse.next()
}

// 最终 matcher 配置，确保根路径和所有子路径都被拦截
export const config = {
  matcher: [
    '/',
    '/:path*',
  ],
} 