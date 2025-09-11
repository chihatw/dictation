// app/api/tags/route.ts
export const runtime = 'nodejs';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  const q = (new URL(req.url).searchParams.get('q') ?? '').trim();
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'no-store',
      },
    });

  if (!q) return json([]);

  const { data, error } = await supabaseAdmin
    .from('dictation_tag_master')
    .select('label')
    .ilike('label', `%${q}%`)
    .order('label', { ascending: true })
    .limit(10);

  if (error) return json({ error: error.message }, 500);
  return json((data ?? []).map((d) => d.label));
}
