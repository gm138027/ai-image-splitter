import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Do nothing and let the default Next.js i18n routing handle everything.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for API routes, static files, and other assets.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|locales|icons|android-chrome|apple-touch|favicon|site\\.webmanifest|robots\\.txt|sitemap\\.xml).*)',
  ],
}; 