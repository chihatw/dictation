'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function saveDictationJournalAction(
  articleId: string,
  body: string
) {
  if (!articleId || !body.trim()) return;

  const supabase = await createClientAction();
  const { error } = await supabase.rpc('save_dictation_journal', {
    p_article_id: articleId,
    p_body: body,
  });
  if (error) throw new Error(error.message);

  revalidatePath('/');
  redirect('/');
}
