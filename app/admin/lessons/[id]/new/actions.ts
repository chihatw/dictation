'use server';

import { requireAdminAction } from '@/lib/auth/guards';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createAssignment(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const title = String(formData.get('title') ?? '').trim();
  const user_id = String(formData.get('user_id') ?? '');
  const lesson_id = String(formData.get('lesson_id') ?? '');

  if (!title) throw new Error('title is required');
  if (!user_id) throw new Error('user_id is required');
  if (!lesson_id) throw new Error('lesson_id is required');

  const { error } = await supabase
    .from('dictation_assignments')
    .insert({ title, user_id, lesson_id });

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/lessons`);
  redirect(`/admin/lessons`);
}

// Assignment の変更、削除は Supabase Console で
// publish, unpublish は lessons のプロパティ
