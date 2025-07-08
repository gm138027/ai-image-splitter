import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES } from './src/lib/urlUtils'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const lngParam = searchParams.get('lng')?.trim()

  const response = NextResponse.next()
  response.headers.set('x-middleware-executed', 'true')

  // If there's a ?lng=xxx parameter and xxx is a supported language
  if (lngParam && SUPPORTED_LOCALES.includes(lngParam as any)) {
    response.headers.set('x-middleware-condition', 'true')
    // Construct new path: /zh-CN/xxx
    let newPath = pathname
    // Avoid duplicate prefixes
    if (!pathname.startsWith(`/${lngParam}`) && lngParam !== 'en') {
      newPath = `/${lngParam}${pathname === '/' ? '' : pathname}`
    }
    // Construct new URL, remove lng parameter, keep other parameters
    const url = request.nextUrl.clone()
    url.pathname = newPath
    url.searchParams.delete('lng')

    const redirectResponse = NextResponse.redirect(url, 301)
    redirectResponse.headers.set('x-middleware-redirect', 'true')
    return redirectResponse
  }

  // Handle multiple prefixes (like /zh-CN/hi/xxx), only keep the first prefix
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length >= 2 && 
      SUPPORTED_LOCALES.includes(pathParts[0] as any) && 
      SUPPORTED_LOCALES.includes(pathParts[1] as any)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${pathParts[0]}/${pathParts.slice(2).join('/')}`

    const redirectResponse = NextResponse.redirect(url, 301)
    redirectResponse.headers.set('x-middleware-multi-prefix-redirect', 'true')
    return redirectResponse
  }

  return response
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