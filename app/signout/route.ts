import { createSupabaseFromReqRes } from '@/lib/supabase/withCookies';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  // サインアウトの場合は、response に紐づいた Cookie をリセットする必要がある
  const supabase = createSupabaseFromReqRes(request, response);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('signOut failed:', error);
  }

  return response;
}
