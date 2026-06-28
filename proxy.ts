import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient, withCookies } from './lib/supabase/middleware';

const AUTH_PREFIXES = [
  '/admin',
  '/articles',
  '/assignments',
  '/cloze',
  '/mvjs',
  '/payments',
];

const AUTH_API_PATHS = ['/api/chat', '/api/tags', '/api/tts'];

export const config = {
  matcher: [
    /*
     * Exclude Next.js internals and static files.
     * This proxy redirects signed-in users away from /signin and refreshes
     * Supabase sessions for authenticated pages/API routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );
}

function isAuthRoute(pathname: string) {
  return (
    matchesPrefix(pathname, AUTH_PREFIXES) || AUTH_API_PATHS.includes(pathname)
  );
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname !== '/signin' && !isAuthRoute(pathname)) {
    return NextResponse.next();
  }

  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname === '/signin' && user) {
    const rootUrl = new URL('/', request.url);
    return withCookies(response, NextResponse.redirect(rootUrl));
  }

  return response;
}
