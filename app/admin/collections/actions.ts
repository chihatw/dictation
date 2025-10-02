'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 作成
export async function createCollection(formData: FormData) {
  const supabase = await createClientAction();
  const title = String(formData.get('title') ?? '').trim();
  const user_id = String(formData.get('user_id') ?? '');

  if (!title) throw new Error('title is required');
  if (!user_id) throw new Error('user_id is required');

  const { error } = await supabase
    .from('dictation_article_collections')
    .insert({ title, user_id });

  if (error) throw new Error(error.message);

  revalidatePath('/admin/collections');
  redirect('/admin/collections');
}

// 更新
export async function updateCollection(formData: FormData) {
  const supabase = await createClientAction();
  const id = String(formData.get('id') ?? '');
  const title = String(formData.get('title') ?? '').trim();
  const user_id = String(formData.get('user_id') ?? '');

  if (!id) throw new Error('id is required');
  if (!title) throw new Error('title is required');
  if (!user_id) throw new Error('user_id is required');

  const { error } = await supabase
    .from('dictation_article_collections')
    .update({ title, user_id })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/collections');
  redirect('/admin/collections');
}

// 削除
export async function deleteCollection(formData: FormData) {
  const supabase = await createClientAction();
  const id = String(formData.get('id') ?? '');
  if (!id) throw new Error('id is required');

  const { error } = await supabase
    .from('dictation_article_collections')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/admin/collections');
}
