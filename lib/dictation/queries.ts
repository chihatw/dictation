import { supabase } from '@/lib/supabase/browser';
import type { Article } from '@/types/dictation';

export async function fetchArticleWithSentences(
  articleId: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('dictation_articles')
    .select(
      `
      id, uid, title, created_at,
      tts_voice_name, speaking_rate, audio_path_full,
      journal:dictation_journals!left (
        id, body, created_at
      ),
      sentences:dictation_sentences (
        id, seq, content, created_at, audio_path,
        submission:dictation_submissions!left ( id, answer, feedback_md, created_at ),
        log:dictation_submission_logs!left ( self_assessed_comprehension, created_at )
      )
    `
    )
    .eq('id', articleId)
    .order('seq', { referencedTable: 'dictation_sentences', ascending: true })
    .order('created_at', {
      referencedTable: 'dictation_sentences.dictation_submission_logs',
      ascending: false,
    })
    .limit(1, { foreignTable: 'dictation_sentences.dictation_submission_logs' })
    .maybeSingle();

  if (error) {
    console.error('[fetchArticleWithSentences]', error);
    return null;
  }
  if (!data) return null;

  const journal = data.journal ?? null;

  return {
    id: data.id,
    uid: data.uid,
    title: data.title,
    created_at: data.created_at,
    journal: journal
      ? { body: journal.body, created_at: journal.created_at }
      : null,
    sentences: (data.sentences ?? []).map((s) => {
      const sac = s?.log?.[0]?.self_assessed_comprehension ?? 4; // 旧データ=4
      return {
        ...s,
        self_assessed_comprehension: sac,
      };
    }),
    tts_voice_name: data.tts_voice_name,
    speaking_rate: data.speaking_rate,
    audio_path_full: data.audio_path_full ?? null,
  };
}
