'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { clampRateForDB } from '@/lib/tts/constants';
import { synthesizeToStorage } from '@/lib/tts/persist';
import { splitIntoSentences } from '@/lib/tts/splitSentences';
import { articleInputSchema } from '@/lib/validation/article';
import pLimit from 'p-limit';

export async function createArticleAction(input: unknown) {
  const parsed = articleInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: '入力が不正です。' };

  const { uid, title, body, ttsVoiceName, speakingRate } = parsed.data;
  const sentences = splitIntoSentences(body);
  if (sentences.length === 0)
    return { ok: false, error: '本文から文が抽出できませんでした。' };

  const supabase = await createClientAction();

  // 1) 記事作成
  const { data: article, error: insErr } = await supabase
    .from('dictation_articles')
    .insert({
      uid,
      title: title.trim(),
      tts_voice_name: ttsVoiceName,
      speaking_rate: clampRateForDB(speakingRate),
    })
    .select('id')
    .single();

  if (insErr || !article?.id)
    return { ok: false, error: '記事の作成に失敗しました。' };

  const articleId = article.id as string;

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
    // 簡易ロールバック
    await supabase.from('dictation_articles').delete().eq('id', articleId);
    return { ok: false, error: '文の作成に失敗しました。' };
  }

  // 3A) 文ごと TTS（公開バケットへ保存）※並列上限で安定化
  const limit = pLimit(4);
  const baseKey = {
    languageCode: 'ja-JP',
    voiceName: ttsVoiceName,
    speakingRate: clampRateForDB(speakingRate),
    provider: 'google' as const,
    version: 1,
  };

  try {
    await Promise.all(
      inserted.map((s) =>
        limit(async () => {
          const { path, hash } = await synthesizeToStorage({
            ...baseKey,
            text: s.content,
          });
          await supabase
            .from('dictation_sentences')
            .update({ audio_path: path, tts_hash: hash })
            .eq('id', s.id);
        })
      )
    );
  } catch {
    // ロールバック方針は任意。まずは安全側で全削除。
    await supabase
      .from('dictation_sentences')
      .delete()
      .eq('article_id', articleId);
    await supabase.from('dictation_articles').delete().eq('id', articleId);
    return { ok: false, error: '音声合成に失敗しました。' };
  }

  // 3B) 記事全体の一括音声（任意だが今回「作る」）
  try {
    const joined = sentences.join('。') + '。'; // 間を少し置きたいなら SSML に変更してもOK
    const { path, hash } = await synthesizeToStorage({
      ...baseKey,
      text: joined,
    });
    await supabase
      .from('dictation_articles')
      .update({ audio_path_full: path, tts_full_hash: hash })
      .eq('id', articleId);
  } catch {
    // ここは致命ではないので握りつぶし（ログだけ）
  }

  return { ok: true, articleId, sentenceCount: rows.length };
}
