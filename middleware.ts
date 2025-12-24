import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ensures a locale cookie exists; doesn't implement locale-specific routing yet.
export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const locale = req.cookies.get('locale')?.value
  if (!locale || (locale !== 'fr' && locale !== 'ar')) {
    // default to French
    res.cookies.set('locale', 'fr', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })
  }
  return res
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)'],
}
