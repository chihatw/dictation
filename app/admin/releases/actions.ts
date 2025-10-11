'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { revalidatePath } from 'next/cache';

export async function createRelease(input: {
  userId: string;
  assignmentId: string;
  dueAtIso: string;
}) {
  const supabase = await createClientAction();
  if (!input.userId || !input.assignmentId || !input.dueAtIso) {
    throw new Error('missing fields');
  }
  const { error } = await supabase.from('dictation_releases').insert({
    user_id: input.userId,
    assignment_id: input.assignmentId,
    due_at: input.dueAtIso,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/admin/releases');
}

export async function publishRelease(releaseId: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_releases')
    .update({ published_at: new Date().toISOString() })
    .eq('id', releaseId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/releases');
}

export async function deleteRelease(releaseId: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_releases')
    .delete()
    .eq('id', releaseId);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/releases');
}
