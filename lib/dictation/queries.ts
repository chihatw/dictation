import { supabase } from '@/lib/supabase/browser';
import type { Article } from '@/types/dictation';

export async function fetchArticleWithSentences(
  articleId: string,
  userId: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('dictation_articles')
    .select(
      `
        id, title, created_at,
        tts_voice_name, speaking_rate,
        audio_path_full,
        sentences:dictation_sentences (
          id, seq, content, created_at,
          audio_path,
          submission:dictation_submissions!left (
            id, answer, feedback_md, created_at
          )
        )
      `
    )
    .eq('id', articleId)
    .eq('sentences.dictation_submissions.user_id', userId)
    .order('seq', { referencedTable: 'dictation_sentences', ascending: true })
    .maybeSingle();

  if (error) {
    console.error('[fetchArticleWithSentences]', error);
    return null;
  }
  if (!data) return null;

  return {
    id: data.id,
    title: data.title,
    created_at: data.created_at,
    sentences: data.sentences ?? [],
    tts_voice_name: data.tts_voice_name,
    speaking_rate: data.speaking_rate,
    audio_path_full: data.audio_path_full ?? null,
  };
}
