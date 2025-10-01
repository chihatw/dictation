import { supabase } from '@/lib/supabase/browser';
import type { Article } from '@/types/dictation';

export async function fetchArticleWithSentences(
  articleId: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('dictation_articles')
    .select(
      `
  id, subtitle, created_at, audio_path_full,
  collection:dictation_article_collections!dictation_articles_collection_fkey ( user_id ),
  journal:dictation_journals!left ( id, body, created_at ),
  sentences:dictation_sentences (
    id, seq, content, created_at, audio_path,
    submission:dictation_submissions!left (
      id, answer, feedback_md, created_at,
      plays_count, elapsed_ms_since_item_view,
      elapsed_ms_since_first_play, self_assessed_comprehension
    )
  )
`
    )
    .eq('id', articleId)
    .order('seq', { referencedTable: 'dictation_sentences', ascending: true })
    .maybeSingle();

  if (error) {
    console.error('[fetchArticleWithSentences]', error);
    return null;
  }
  if (!data) return null;

  const journal = data.journal ?? null;

  return {
    id: data.id,
    uid: data.collection?.user_id,
    title: data.subtitle,
    created_at: data.created_at,
    journal: journal
      ? { body: journal.body, created_at: journal.created_at }
      : null,
    sentences: (data.sentences ?? []).map((s) => {
      const sub = s.submission?.[0] ?? null;
      return {
        ...s,
        self_assessed_comprehension: sub?.self_assessed_comprehension,
      };
    }),
    audio_path_full: data.audio_path_full ?? null,
  };
}
