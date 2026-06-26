import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient, withCookies } from './lib/supabase/middleware';

const PUBLIC_PATHS = ['/', '/tokusho'];
const PUBLIC_PREFIXES = ['/dev'];
const SIGNIN_PREFIXES = ['/signin'];
const ADMIN_PREFIXES = ['/admin'];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isPublicPage =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(prefix + '/'),
    );
  const isSignin = SIGNIN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
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
