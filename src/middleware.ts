import { NextRequest, NextResponse } from 'next/server'

const RETIRED_LOCALES = new Set(['hi', 'ms', 'tl', 'kk'])
const RETIRED_LOCALE_ALIASES = new Set(['fil', 'filipino', 'kz'])

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const url = request.nextUrl.clone()
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegmentLower = pathSegments[0]?.toLowerCase()

  if (firstSegmentLower && (RETIRED_LOCALES.has(firstSegmentLower) || RETIRED_LOCALE_ALIASES.has(firstSegmentLower))) {
    // Retired locales return 410 to speed deindexing.
    return new NextResponse('Gone', { status: 410 })
  }

  if (url.searchParams.has('lng')) {
    url.searchParams.delete('lng')
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
}
