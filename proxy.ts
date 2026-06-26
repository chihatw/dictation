import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient, withCookies } from './lib/supabase/middleware';

const PUBLIC_PATHS = ['/', '/tokusho'];
const DEV_PREFIXES = ['/dev'];
const SIGNIN_PREFIXES = ['/signin'];
const ADMIN_PREFIXES = ['/admin'];

export const config = {
  matcher: [
    /*
     * Exclude Next.js internals and static files from auth redirects.
     * If these are proxied, production CSS/JS chunks can be redirected to /signin.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isDevRoute = DEV_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );

  // /dev 配下は認証なしで通す
  if (isDevRoute) {
    return NextResponse.next();
  }

  const isPublicPage = PUBLIC_PATHS.includes(pathname);
  const isSignin = SIGNIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );
  const isAdminRoute = ADMIN_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
  );

  // 公開ページは getUser() せずそのまま通す
  if (isPublicPage) {
    return NextResponse.next();
  }

  // ここから先は getUser() が必要なルートのみ
  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = (user?.app_metadata as any)?.role;

  // サインインページはログイン済みなら / へリダイレクト
  if (isSignin) {
    if (user) {
      const rootUrl = new URL('/', request.url);
      return withCookies(response, NextResponse.redirect(rootUrl));
    }
    return response;
  }

  // 未ログインなら /signin へリダイレクト
  if (!user) {
    const signinUrl = new URL('/signin', request.url);
    return withCookies(response, NextResponse.redirect(signinUrl));
  }

  // /admin 配下は admin のみ
  if (isAdminRoute && role !== 'admin') {
    const url = new URL('/', request.url);
    return withCookies(response, NextResponse.redirect(url));
  }

  return response;
}
