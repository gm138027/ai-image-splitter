import { NextRequest, NextResponse } from 'next/server'

// 支持的语言列表，根据你的实际配置调整
const supportedLocales = ['en', 'zh-CN', 'id', 'pt', 'th', 'hi', 'ru', 'vi', 'ja']

export function middleware(request: NextRequest) {
  const { searchParams, pathname, origin } = request.nextUrl
  const lng = searchParams.get('lng')

  if (lng && supportedLocales.includes(lng)) {
    // 首页特殊处理
    let newPath = pathname
    if (pathname === '/' || pathname === '') {
      newPath = `/${lng}`
    } else if (!pathname.startsWith(`/${lng}`)) {
      newPath = `/${lng}${pathname}`
    }
    // 拼接新URL（去掉 query）
    const url = `${origin}${newPath}`
    return NextResponse.redirect(url, 308)
  }
  // 其它情况不处理
  return NextResponse.next()
}

// 可选：只在页面请求时生效
export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
} 