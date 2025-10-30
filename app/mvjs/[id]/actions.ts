// app/mvjs/[id]/actions.ts
'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { revalidatePath } from 'next/cache';

export async function submitMvjAndAwardsAction(input: {
  mvjId: string;
  reason: string;
  imageUrl: string;
  initialIds: string[];
  bestId: string | null;
  hmIds: string[];
}) {
  const supabase = await createClientAction();
  const { mvjId, reason, imageUrl, initialIds, bestId, hmIds } = input;

  const { error } = await supabase.rpc('submit_mvj_and_awards', {
    p_mvj_id: mvjId,
    p_reason: reason.trim(),
    p_image_url: imageUrl,
    p_initial_ids: initialIds,
    p_best_id: (bestId ?? null) as any,
    p_hm_ids: hmIds,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/mvjs/${mvjId}`);
  return { reason: reason.trim(), imageUrl };
}
