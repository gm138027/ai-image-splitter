import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES, SEO_CONFIG, normalizeLegacyLocale } from './config/seo'

const RETIRED_LOCALES = new Set(['hi', 'ms', 'tl'])
const RETIRED_LOCALE_ALIASES = new Set(['fil', 'filipino'])

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()

  const lngParam = url.searchParams.get('lng')
  if (lngParam) {
    const rawLng = lngParam.trim()
    const rawLngLower = rawLng.toLowerCase()
    if (RETIRED_LOCALES.has(rawLngLower) || RETIRED_LOCALE_ALIASES.has(rawLngLower)) {
      return new NextResponse('Gone', { status: 410 })
    }

    const normalizedLocale = normalizeLegacyLocale(rawLng)
    if (RETIRED_LOCALES.has(normalizedLocale)) {
      return new NextResponse('Gone', { status: 410 })
    }

    url.searchParams.delete('lng')

    if (normalizedLocale === SEO_CONFIG.locales.default) {
      url.pathname = pathname
    } else {
      url.pathname = `/${normalizedLocale}${pathname}`
    }

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

  if (pathname !== '/' && pathname.endsWith('/')) {
    url.pathname = pathname.slice(0, -1)
    return NextResponse.redirect(url, 301)
  }

  const response = NextResponse.next()

  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  if (pathname.startsWith('/_next/static/') || pathname.startsWith('/images/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)'],
}
