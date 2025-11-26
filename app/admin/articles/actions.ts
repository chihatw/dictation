'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { clampRateForDB } from '@/lib/tts/constants';
import { synthesizeToStorage } from '@/lib/tts/persist';
import { splitIntoSentences } from '@/lib/tts/splitSentences';
import { revalidatePath } from 'next/cache';

export async function createArticle(input: unknown) {
  // 最小バリデーション（必要なら zod に差し替え可）
  const data = input as {
    assignmentId: string;
    subtitle: string;
    body: string;
    ttsVoiceName: string;
    speakingRate: number;
  };
  if (!data?.assignmentId || !data?.subtitle || !data?.body) {
    return { ok: false, error: '入力が不正です' };
  }

  const sentences = splitIntoSentences(data.body);
  if (sentences.length === 0) return { ok: false, error: '本文が空です' };

  const supabase = await createClientAction();

  // 1) 記事作成（audio_path_full は null のまま）
  const { data: ins, error: rpcErr } = await supabase.rpc(
    'insert_article_with_next_seq',
    { p_assignment_id: data.assignmentId, p_subtitle: data.subtitle.trim() }
  );

  if (rpcErr || !ins?.[0]?.id)
    return { ok: false, error: '記事作成に失敗しました' };
  const articleId = ins[0].id as string;

  // 2) 文を一括挿入
  const rows = sentences.map((content, i) => ({
    article_id: articleId,
    seq: i + 1,
    content,
  }));
  const { data: inserted, error: senErr } = await supabase
    .from('dictation_sentences')
    .insert(rows)
    .select('id, seq, content');

  if (senErr || !inserted) {
    await supabase.from('dictation_articles').delete().eq('id', articleId);
    return { ok: false, error: '文の作成に失敗しました' };
  }

  // 3) 各文の TTS（並列数は控えめ） ← 置き換え
  try {
    const limit = 4;
    for (let i = 0; i < inserted.length; i += limit) {
      const slice = inserted.slice(i, i + limit);
      await Promise.all(
        slice.map(async (s) => {
          const { path } = await synthesizeToStorage({
            languageCode: 'ja-JP',
            voiceName: data.ttsVoiceName,
            speakingRate: clampRateForDB(data.speakingRate),
            provider: 'google',
            version: 1,
            text: s.content,
          });
          await supabase
            .from('dictation_sentences')
            .update({ audio_path: path })
            .eq('id', s.id);
        })
      );
    }
  } catch {
    // 旧ロールバック方針を踏襲（必要なければ削除可）
    await supabase
      .from('dictation_sentences')
      .delete()
      .eq('article_id', articleId);
    await supabase.from('dictation_articles').delete().eq('id', articleId);
    return { ok: false, error: '音声合成に失敗しました' };
  }

  // 4) 記事全体の一括音声も作成（旧ロジック踏襲）。失敗は致命ではない。
  try {
    const joined = sentences.join('。') + '。';
    const { path } = await synthesizeToStorage({
      languageCode: 'ja-JP',
      voiceName: data.ttsVoiceName,
      speakingRate: clampRateForDB(data.speakingRate),
      provider: 'google',
      version: 1,
      text: joined,
    });
    await supabase
      .from('dictation_articles')
      .update({ audio_path_full: path })
      .eq('id', articleId);
  } catch {
    // ログだけに留めるならここで握りつぶし
  }

  revalidatePath('/admin/articles');
  return { ok: true, articleId, sentenceCount: rows.length };
}

export async function updateSubtitle(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const subtitle = String(formData.get('subtitle') ?? '').trim();
  if (!id || !subtitle) return { ok: false, error: '入力が不正です' };

  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_articles')
    .update({ subtitle })
    .eq('id', id);

  if (error) return { ok: false, error: error.message };
  revalidatePath('/admin/articles');
  return { ok: true };
}

export async function setJournalLocked(journalId: string, locked: boolean) {
  const supabase = await createClientAction();

  const { error } = await supabase
    .from('dictation_journals')
    .update({ locked })
    .eq('id', journalId);

  if (error) {
    // ロールバックしたい場合は、呼び出し側でキャッチできるようにそのまま投げる
    throw new Error(error.message);
  }

  // 一覧を再取得させる
  revalidatePath('/admin/articles');
}
