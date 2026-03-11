import { NextRequest, NextResponse } from 'next/server'
import localeConfigJson from '../config/locales.json'

const localeConfig = localeConfigJson as {
  retiredLocales?: readonly string[]
  retiredLocaleAliases?: readonly string[]
  deprecatedQueryLocaleParam?: string
}

const DEPRECATED_QUERY_LOCALE_PARAM = localeConfig.deprecatedQueryLocaleParam?.trim() || 'lng'
const RETIRED_LOCALE_TOKENS = new Set(
  [...(localeConfig.retiredLocales || []), ...(localeConfig.retiredLocaleAliases || [])].map(locale =>
    locale.toLowerCase()
  )
)

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  if (url.searchParams.has(DEPRECATED_QUERY_LOCALE_PARAM)) {
    url.searchParams.delete(DEPRECATED_QUERY_LOCALE_PARAM)
    return NextResponse.redirect(url, 301)
  }

  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const firstSegmentLower = pathSegments[0].toLowerCase()

    // Retired locales return 410 to speed deindexing.
    if (RETIRED_LOCALE_TOKENS.has(firstSegmentLower)) {
      return new NextResponse('Gone', { status: 410 })
    }

  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
}
