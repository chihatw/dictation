'use server';

import { createClient } from '@/lib/supabase/server'; // 既存のサーバークライアントに合わせて
import { clampRateForDB } from '@/lib/tts/constants';
import { splitIntoSentences } from '@/lib/tts/splitSentences';
import { articleInputSchema } from '@/lib/validation/article';

export async function createArticleAction(input: unknown) {
  // サーバー側でもバリデーション（信頼しすぎない）
  const parsed = articleInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: '入力が不正です。' };
  }

  const { uid, title, body, ttsVoiceName, speakingRate } = parsed.data;

  const sentences = splitIntoSentences(body);
  if (sentences.length === 0) {
    return { ok: false, error: '本文から文が抽出できませんでした。' };
  }

  const supabase = await createClient();

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

  if (insErr || !article?.id) {
    return { ok: false, error: '記事の作成に失敗しました。' };
  }

  const articleId = article.id as string;

  // 2) 文を一括挿入
  const rows = sentences.map((content, i) => ({
    article_id: articleId,
    seq: i + 1,
    content,
  }));

  const { error: senErr } = await supabase
    .from('dictation_sentences')
    .insert(rows);

  if (senErr) {
    // 簡易ロールバック
    await supabase.from('dictation_articles').delete().eq('id', articleId);
    return { ok: false, error: '文の作成に失敗しました。' };
  }

  return { ok: true, articleId, sentenceCount: rows.length };
}
