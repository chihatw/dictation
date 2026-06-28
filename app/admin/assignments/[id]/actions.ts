'use server';

import { requireAdminAction } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';

export async function setJournalLocked(
  journalId: string,
  locked: boolean,
  assignment_id: string,
) {
  const { supabase } = await requireAdminAction();

  const { error } = await supabase
    .from('dictation_journals')
    .update({ locked })
    .eq('id', journalId);

  if (error) {
    // ロールバックしたい場合は、呼び出し側でキャッチできるようにそのまま投げる
    throw new Error(error.message);
  }

  // 一覧を再取得させる
  revalidatePath(`/admin/assignments/${assignment_id}`);
}
