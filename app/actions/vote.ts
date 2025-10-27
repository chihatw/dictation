// app/journals/actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';

export async function voteAction(
  prev: { score: number; error: string | null },
  formData: FormData
) {
  const id = String(formData.get('id') || '');
  const delta = Number(formData.get('delta') || 0);
  const current = Number(formData.get('current') || 0);

  const supa = await createClient();
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) return { score: current, error: 'unauthorized' };

  const { error } = await supa.rpc('journal_vote', {
    p_id: id,
    p_delta: delta,
  });
  if (error) {
    const code = (error as { code?: string; message?: string })?.code ?? '';
    const msg =
      code === 'over_request_rate_limit'
        ? 'rate_limited'
        : ((error as { message?: string })?.message ?? '').includes(
            'vote_not_available'
          )
        ? 'not_yet'
        : 'rpc_error';
    return { score: current, error: msg };
  }
  return { score: current + delta, error: null };
}
