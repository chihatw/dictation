// app/mvjs/[id]/actions.ts
'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { revalidatePath } from 'next/cache';
import { extractPathFromPublicUrl } from './utils';

export async function submitMvjAndAwardsAction(formData: FormData) {
  const supabase = await createClientAction();
  const mvjId = String(formData.get('mvjId') ?? '');
  const reason = String(formData.get('reason') ?? '').trim();
  const initialIds = JSON.parse(
    String(formData.get('initialIds') ?? '[]')
  ) as string[];
  const bestId = String(formData.get('bestId') ?? '') || null;
  const hmIds = JSON.parse(String(formData.get('hmIds') ?? '[]')) as string[];
  const oldImageUrl = String(formData.get('oldImageUrl') ?? '');
  const file = formData.get('image') as File | null;

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userRes?.user) throw new Error('auth required');
  const uid = userRes.user.id;

  const bucket = 'dictation-mvj';
  let publicUrl: string | null = null;

  if (file && file.size > 0) {
    // 1) 旧画像削除（存在すれば）
    if (oldImageUrl) {
      const oldPath = extractPathFromPublicUrl(oldImageUrl, bucket);
      if (oldPath) {
        await supabase.storage
          .from(bucket)
          .remove([oldPath])
          .catch(() => {});
      }
    }

    // 2) 新規アップロード
    const ext = file.type.includes('jpeg')
      ? 'jpg'
      : file.type.includes('png')
      ? 'png'
      : file.type.includes('webp')
      ? 'webp'
      : file.type.includes('gif')
      ? 'gif'
      : 'bin';

    const filename = `${mvjId}_${Date.now()}.${ext}`;
    const path = `${uid}/${filename}`;

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        contentType: file.type || undefined,
      });

    if (upErr) throw new Error(upErr.message);

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    publicUrl = pub.publicUrl;
  }

  // 3) RPC 更新。画像を替えない場合は null を渡してサーバー側で据え置き運用にするか、
  //    ここで publicUrl ?? oldImageUrl を渡す運用にする。
  const urlForDb = publicUrl ?? (oldImageUrl || null);

  const { error } = await supabase.rpc('submit_mvj_and_awards', {
    p_mvj_id: mvjId,
    p_reason: reason,
    p_image_url: urlForDb!,
    p_initial_ids: initialIds,
    p_best_id: (bestId ?? null) as any,
    p_hm_ids: hmIds,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/mvjs/${mvjId}`);
  return { reason, imageUrl: urlForDb };
}
