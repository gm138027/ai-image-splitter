import { NextRequest, NextResponse } from 'next/server'

// 只允许的语言前缀
const locales = ['en', 'zh-CN', 'id', 'pt', 'tl', 'ms', 'hi', 'vi', 'kk', 'ru']

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const lngParam = searchParams.get('lng')

  // 只要有?lng=xxx参数，且xxx是受支持的语言
  if (lngParam && locales.includes(lngParam)) {
    // 构造新路径：/zh-CN/xxx
    let newPath = pathname
    // 避免重复前缀
    if (!pathname.startsWith(`/${lngParam}`) && lngParam !== 'en') {
      newPath = `/${lngParam}${pathname === '/' ? '' : pathname}`
    }
    // 构造新URL，去掉lng参数，保留其它参数
    const url = request.nextUrl.clone()
    url.pathname = newPath
    url.searchParams.delete('lng')
    return NextResponse.redirect(url, 301)
  }

  // 处理多重前缀（如 /zh-CN/hi/xxx），只保留第一个前缀
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length >= 2 && locales.includes(pathParts[0]) && locales.includes(pathParts[1])) {
    const url = request.nextUrl.clone()
    url.pathname = `/${pathParts[0]}/${pathParts.slice(2).join('/')}`
    return NextResponse.redirect(url, 301)
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