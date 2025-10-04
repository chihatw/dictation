// app/admin/releases/actions.ts
'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { jstLocalToUtcIso } from '@/utils/jstLocalToUtcIso';
import {
  revalidateAdminReleases,
  revalidateReleaseAll,
  revalidateReleaseDetail,
} from '@/utils/revalidate';

// 1) 新規作成（published_at は常にNULL）
export async function createRelease(input: {
  uid: string;
  dueAtJst?: string | null;
}) {
  const due_at = input.dueAtJst ? jstLocalToUtcIso(input.dueAtJst) : null;

  const { error } = await supabaseAdmin
    .from('dictation_releases')
    .insert([{ user_id: input.uid, due_at, published_at: null }]);

  if (error) throw error;
  await revalidateAdminReleases();
}

// 2) 公開（空リリース許可）　items があるかどうかのチェックはしない
export async function publishRelease(id: string) {
  const { error } = await supabaseAdmin
    .from('dictation_releases')
    .update({ published_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
  await revalidateReleaseAll(id);
}

// 3) 記事追加（pos=最大+1。競合時1回リトライ）
export async function addItem(input: { releaseId: string; articleId: string }) {
  // pos = 最大+1
  const { data: top, error: maxErr } = await supabaseAdmin
    .from('dictation_release_items')
    .select('pos')
    .eq('release_id', input.releaseId)
    .order('pos', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (maxErr) throw maxErr;

  const nextPos = (top?.pos ?? 0) + 1;

  const { data, error: insErr } = await supabaseAdmin
    .from('dictation_release_items')
    .insert([
      {
        release_id: input.releaseId,
        article_id: input.articleId,
        pos: nextPos,
      },
    ])
    .select('id')
    .single();
  if (insErr) throw insErr;

  await revalidateReleaseDetail(input.releaseId);
  return data.id as string;
}

// 4) 記事削除
export async function removeItem(itemId: string) {
  // 削除前に release_id を取得（再検証のため）
  const { data: before, error: getErr } = await supabaseAdmin
    .from('dictation_release_items')
    .select('release_id')
    .eq('id', itemId)
    .single();
  if (getErr) throw getErr;

  const { error } = await supabaseAdmin
    .from('dictation_release_items')
    .delete()
    .eq('id', itemId);

  if (error) throw error;

  await revalidateReleaseDetail(before.release_id as string);
}
