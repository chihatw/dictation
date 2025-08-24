// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * サインインページ以外は認証必須
 * 未ログイン時は /signin へリダイレクト
 * サインインページはログイン済みなら / へリダイレクト
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // サインインページはログイン済みなら / へリダイレクト
  if (request.nextUrl.pathname.startsWith('/signin')) {
    if (user) {
      const rootUrl = new URL('/', request.url);
      return NextResponse.redirect(rootUrl);
    }
    return supabaseResponse;
  }

  // 未ログインなら /signin へリダイレクト
  if (!user) {
    const signinUrl = new URL('/signin', request.url);
    return NextResponse.redirect(signinUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    // ルート配下全て。ただし、_next, api, public, faviconは除外（signinは除外しない）
    '/((?!_next/|api/|favicon.ico|public/).*)',
  ],
};
