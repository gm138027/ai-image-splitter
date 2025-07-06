import { NextRequest, NextResponse } from 'next/server'

// 支持的语言列表，需与next-i18next.config.js保持一致
const supportedLocales = ['en', 'zh-CN', 'id', 'pt', 'tl', 'ms', 'hi', 'vi', 'kk', 'ru']

export default function middleware(request: NextRequest) {
  const { searchParams, pathname, origin } = request.nextUrl
  const lng = searchParams.get('lng')

  if (lng && supportedLocales.includes(lng)) {
    // 去除已有的语言前缀，防止嵌套
    const localePattern = new RegExp(`^/(${supportedLocales.join('|')})(/|$)`, 'i')
    let newPath = pathname.replace(localePattern, '')
    // 首页特殊处理
    if (newPath === '' || newPath === '/') {
      newPath = ''
    }
    // 拼接新URL（去掉 query）
    const url = `${origin}/${lng}${newPath}`
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}

// 只在页面请求时生效
export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
} 