import { NextResponse, type NextRequest } from 'next/server';
import { createMiddlewareClient, withCookies } from './lib/supabase/middleware';

/**
 * 認証・権限制御
 *
 * - / は公開
 * - /tokusho は公開
 * - /signin は未ログイン専用
 * - その他は認証必須
 * - /admin は admin のみ
 */

export async function proxy(request: NextRequest) {
  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicPage = pathname === '/' || pathname === '/tokusho';
  const isSignin = pathname.startsWith('/signin');
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const role = (user?.app_metadata as any)?.role;

  // サインインページはログイン済みなら / へリダイレクト
  if (isSignin) {
    if (user) {
      const rootUrl = new URL('/', request.url);
      return withCookies(response, NextResponse.redirect(rootUrl));
    }
    return response;
  }

  // 公開ページは未ログインでも表示
  if (isPublicPage) {
    return response;
  }

  // 未ログインなら /signin へリダイレクト
  if (!user) {
    const signinUrl = new URL('/signin', request.url);
    return withCookies(response, NextResponse.redirect(signinUrl));
  }

  // /admin 配下は admin のみ。違えば /
  if (isAdminRoute && role !== 'admin') {
    const url = new URL('/', request.url);
    return withCookies(response, NextResponse.redirect(url));
  }

  return response;
}

export const config = {
  matcher: [
    // ルート配下全て。ただし、_next, api, public, faviconは除外（signinは除外しない）
    '/((?!_next/|api/|favicon.ico|public/).*)',
  ],
};
