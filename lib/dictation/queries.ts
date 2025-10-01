import { supabase } from '@/lib/supabase/browser';
import type { Article } from '@/types/dictation';

export async function fetchArticleWithSentences(
  articleId: string
): Promise<Article | null> {
  const { data, error } = await supabase.rpc('get_article_page', {
    p_article_id: articleId,
  });

  if (error) {
    console.error('[get_article_page]', error);
    return null;
  }

  if (!data) return null;

  // RPC は Article 形状の JSON を返す想定。最低限の整形のみ。
  const a = data as {
    id: string;
    uid: string;
    title: string;
    created_at: string;
    audio_path_full: string | null;
    journal: { body: string; created_at: string } | null;
    sentences: Array<{
      id: string;
      seq: number;
      content: string;
      created_at: string;
      audio_path: string | null;
      submission: {
        id: string;
        answer: string; // not null
        feedback_md: string | null; // null 許容
        created_at: string;
        self_assessed_comprehension: number;
      } | null;
    }>;
  };

  const article: Article = {
    id: a.id,
    uid: a.uid,
    title: a.title,
    created_at: a.created_at,
    journal: a.journal,
    audio_path_full: a.audio_path_full,
    sentences: a.sentences.map((s) => ({
      id: s.id,
      seq: s.seq,
      content: s.content,
      created_at: s.created_at,
      audio_path: s.audio_path,
      submission: s.submission, // 既に単一 or null
    })),
  };

  return article;
}
