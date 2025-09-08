// app/api/tags/route.ts
export const runtime = 'nodejs';

import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim();
  if (!q)
    return new Response('[]', {
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    });

  const { data, error } = await supabaseAdmin
    .from('dictation_teacher_tags_view')
    .select('sample_label')
    .ilike('sample_label', `%${q}%`)
    .order('sample_label', { ascending: true })
    .limit(10);

  if (error) return new Response(error.message, { status: 500 });
  return new Response(JSON.stringify((data ?? []).map((d) => d.sample_label)), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
  });
}
