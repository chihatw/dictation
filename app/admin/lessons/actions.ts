'use server';

import { requireAdminAction } from '@/lib/auth/guards';
import { jstLocalToUtcIso } from '@/utils/jstLocalToUtcIso';
import { revalidatePath } from 'next/cache';

export async function createLesson(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const due_at = formData.get('due_at');

  if (!due_at) throw new Error('due_at is required');

  const { error } = await supabase
    .from('dictation_lessons')
    .insert({ due_at: jstLocalToUtcIso(String(due_at)) });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/lessons');
}

export async function publishLesson(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = String(formData.get('id') ?? '');
  if (!id) throw new Error('id is required');

  const { error } = await supabase
    .from('dictation_lessons')
    .update({ published_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/lessons');
}

export async function unpublishLesson(formData: FormData) {
  const { supabase } = await requireAdminAction();
  const id = String(formData.get('id') ?? '');
  if (!id) throw new Error('id is required');

  const { error } = await supabase
    .from('dictation_lessons')
    .update({ published_at: null })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/lessons');
}
