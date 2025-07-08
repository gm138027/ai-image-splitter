import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES } from './src/lib/urlUtils'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const lngParam = searchParams.get('lng')?.trim()

  // ONLY handle legacy ?lng=... URLs
  if (lngParam && SUPPORTED_LOCALES.includes(lngParam as any)) {
    let newPath = pathname
    // Avoid creating paths like /en/blog - 'en' is the default and doesn't need a prefix
    if (lngParam !== 'en') {
      newPath = `/${lngParam}${pathname === '/' ? '' : pathname}`
    }

    const url = request.nextUrl.clone()
    url.pathname = newPath
    url.searchParams.delete('lng') // Clean up the URL

    // Use a 301 Permanent Redirect to signal to Google that this change is final.
    return NextResponse.redirect(url, 301)
  }

  // For all other requests, do nothing and let Next.js's default i18n routing handle it.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (icon)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|locales|icons|android-chrome|apple-touch|favicon|site\\.webmanifest|robots\\.txt|sitemap\\.xml).*)',
  ],
} 