'use server';

import { requireUserAction } from '@/lib/auth/guards';
import { ClozeSpan } from '@/types/dictation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SpansSchema = z.array(z.tuple([z.number(), z.number()]));

export async function updateOwnJournalClozeSpans(params: {
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

  const { supabase, user } = await requireUserAction();

  const { data: journal, error: journalError } = await supabase
    .from('dictation_journals')
    .select(
      `
        id,
        locked,
        dictation_articles!inner (
          dictation_assignments!inner (
            user_id
          )
        )
      `,
    )
    .eq('id', params.id)
    .eq('locked', false)
    .eq('dictation_articles.dictation_assignments.user_id', user.id)
    .maybeSingle();

  if (journalError) return { ok: false as const, error: journalError.message };
  if (!journal) return { ok: false as const, error: 'not found' };

  const { error } = await supabase
    .from('dictation_journals')
    .update({ cloze_spans: params.spans })
    .eq('id', params.id)
    .eq('locked', false);

  if (error) return { ok: false as const, error: error.message };

  revalidatePath(`/cloze/${params.id}/edit`);
  return { ok: true as const };
}
