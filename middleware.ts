import { NextRequest, NextResponse } from 'next/server';

// All supported languages and the default language are imported from the single source of truth.
import { i18n } from './next-i18next.config';
const SUPPORTED_LOCALES = i18n.locales;
const DEFAULT_LOCALE = i18n.defaultLocale;

/**
 * Parses the Accept-Language header to find the best matching language.
 * @param {string | null} acceptLanguageHeader - The Accept-Language header from the request.
 * @returns {string} The best supported locale.
 */
function getBestLocale(acceptLanguageHeader: string | null): string {
  if (!acceptLanguageHeader) {
    return DEFAULT_LOCALE;
  }

  // A simple parser that prefers exact matches ('zh-CN') over partial matches ('zh').
  const languages = acceptLanguageHeader.split(',').map((lang: string) => {
    const parts = lang.split(';');
    return { code: parts[0].trim(), q: parts[1] ? parseFloat(parts[1].replace('q=', '')) : 1.0 };
  }).sort((a, b) => b.q - a.q);

  for (const lang of languages) {
    // Check for exact match
    if (SUPPORTED_LOCALES.includes(lang.code)) {
      return lang.code;
    }
    // Check for partial match (e.g., 'zh' matches 'zh-CN')
    const baseLang = lang.code.split('-')[0];
    const found = SUPPORTED_LOCALES.find(supported => supported.startsWith(baseLang));
    if (found) {
      return found;
    }
  }

  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { headers } = request;

  // Priority 1: Handle legacy ?lng=... URLs for SEO.
  const lngParam = searchParams.get('lng')?.trim();
  if (lngParam && SUPPORTED_LOCALES.includes(lngParam)) {
    const url = request.nextUrl.clone();
    // Redirect to a path WITH a prefix if it's not the default locale.
    // Redirect to a path WITHOUT a prefix if it IS the default locale.
    url.pathname = lngParam === DEFAULT_LOCALE
      ? pathname.replace(new RegExp(`^/${lngParam}`), '') || '/'
      : `/${lngParam}${pathname}`;
    
    url.searchParams.delete('lng');
    return NextResponse.redirect(url, 301); // 301 Permanent Redirect for SEO
  }

  // Priority 2: Check if the path already has a supported locale prefix. If so, do nothing.
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Priority 3: Auto-detect language for root requests and redirect.
  const bestLocale = getBestLocale(headers.get('accept-language'));

  // Only redirect if the detected locale is not the default one.
  if (bestLocale !== DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = `/${bestLocale}${pathname}`;
    return NextResponse.redirect(url); // 302 Temporary Redirect for user convenience
  }
  
  // If the best locale is the default, do nothing and let Next.js handle it.
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