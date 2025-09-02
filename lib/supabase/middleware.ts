// lib/supabase/middleware.ts
import type { Database } from '@/types/supabase';
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

type CookieSetItem = {
  name: string;
  value: string;
  options?: Parameters<NextResponse['cookies']['set']>[2];
};

export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(items) {
          // request 側は options なし
          items.forEach(({ name, value }: CookieSetItem) => {
            request.cookies.set(name, value);
          });

          // 新しい response を作り直して Set-Cookie を積む
          response = NextResponse.next({ request });

          items.forEach((item: CookieSetItem) => {
            if (item.options) {
              response.cookies.set(item.name, item.value, item.options);
            } else {
              response.cookies.set(item.name, item.value);
            }
          });
        },
      },
    }
  );

  return { supabase, response };
}

export function withCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach(({ name, value }) => {
    to.cookies.set(name, value);
  });
  return to;
}
