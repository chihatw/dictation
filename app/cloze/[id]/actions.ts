'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { ClozeSpan } from '@/types/dictation';
import { z } from 'zod';

const SpansSchema = z.array(z.tuple([z.number(), z.number()]));

export async function updateJournalClozeSpans(params: {
  id: string;
  spans: ClozeSpan[];
}): Promise<{
  ok: boolean;
  error?: string;
}> {
  const parsed = SpansSchema.safeParse(params.spans);

  if (!parsed.success) {
    return { ok: false as const, error: 'invalid spans' };
  }

  const supabase = await createClientAction();

  const { error } = await supabase
    .from('dictation_journals')
    .update({ cloze_spans: params.spans })
    .eq('id', params.id);

  if (error) return { ok: false as const, error: error.message };

  // revalidatePath()
  return { ok: true as const };
}
