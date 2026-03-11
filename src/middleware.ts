import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES } from './config/seo'

const RETIRED_LOCALES = new Set(['hi', 'ms', 'tl', 'kk'])
const RETIRED_LOCALE_ALIASES = new Set(['fil', 'filipino', 'kz'])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  if (url.searchParams.has('lng')) {
    url.searchParams.delete('lng')
    return NextResponse.redirect(url, 301)
  }

  const pathSegments = pathname.split('/').filter(Boolean)
  if (pathSegments.length > 0) {
    const firstSegment = pathSegments[0]
    const firstSegmentLower = firstSegment.toLowerCase()

    // Retired locales return 410 to speed deindexing.
    if (RETIRED_LOCALES.has(firstSegmentLower) || RETIRED_LOCALE_ALIASES.has(firstSegmentLower)) {
      return new NextResponse('Gone', { status: 410 })
    }

    if (firstSegment.length === 2 || firstSegment.includes('-')) {
      if (!SUPPORTED_LOCALES.includes(firstSegment as any)) {
        const restPath = pathSegments.slice(1).join('/')
        url.pathname = restPath ? `/${restPath}` : '/'
        return NextResponse.redirect(url, 301)
      }
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
