import { supabase } from '@/lib/supabase/browser';
import type { Article, Sentence, Tag } from '@/types/dictation';

type RpcArticle = {
  id: string;
  uid: string;
  collection_id: string;
  title: string; // dictation_articles.subtitle
  created_at: string;
  audio_path_full: string | null;
  journal: {
    body: string;
    created_at: string;
  } | null;
  sentences: {
    id: string;
    seq: number;
    content: string;
    created_at: string;
    audio_path: string | null;
    submission: {
      id: string;
      answer: string | null;
      feedback_md: string | null;
      teacher_feedback: string | null; // ←統合後に追加
      created_at: string;
      self_assessed_comprehension: number | null;
      tags: {
        id: string;
        created_at: string;
        tag_master_id: string;
        label: string;
      }[];
    } | null;
  }[];
};

export async function fetchArticleWithSentences(
  articleId: string
): Promise<Article | null> {
  const { data, error } = await supabase.rpc('get_article_page', {
    p_article_id: articleId,
  });

  if (error || !data) return null;

  const a = data as RpcArticle;

  const article: Article = {
    id: a.id,
    uid: a.uid,
    title: a.title,
    created_at: a.created_at,
    journal: a.journal,
    audio_path_full: a.audio_path_full,
    collection_id: a.collection_id,
    sentences: a.sentences.map(
      (s): Sentence => ({
        id: s.id,
        seq: s.seq,
        content: s.content,
        created_at: s.created_at,
        audio_path: s.audio_path,
        // submission に teacher_feedback と tags が既に内包されている
        submission: s.submission
          ? {
              id: s.submission.id,
              answer: s.submission.answer,
              feedback_md: s.submission.feedback_md,
              teacher_feedback: s.submission.teacher_feedback,
              created_at: s.submission.created_at,
              self_assessed_comprehension:
                s.submission.self_assessed_comprehension,
              tags: (Array.isArray(s.submission.tags)
                ? s.submission.tags
                : []) as Tag[],
            }
          : null,
      })
    ),
  };

  return article;
}
