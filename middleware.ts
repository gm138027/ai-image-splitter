import { NextRequest, NextResponse } from 'next/server'
import { SUPPORTED_LOCALES } from './src/lib/urlUtils'

export function middleware(request: NextRequest) {
  console.log('Middleware executed', request.nextUrl.href)
  const { pathname, searchParams } = request.nextUrl
  const lngParam = searchParams.get('lng')?.trim()

  // If there's a ?lng=xxx parameter and xxx is a supported language
  if (lngParam && SUPPORTED_LOCALES.includes(lngParam as any)) {
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
    return NextResponse.redirect(url, 301)
  }

  // Handle multiple prefixes (like /zh-CN/hi/xxx), only keep the first prefix
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length >= 2 && 
      SUPPORTED_LOCALES.includes(pathParts[0] as any) && 
      SUPPORTED_LOCALES.includes(pathParts[1] as any)) {
    const url = request.nextUrl.clone()
    url.pathname = `/${pathParts[0]}/${pathParts.slice(2).join('/')}`
    return NextResponse.redirect(url, 301)
  }

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