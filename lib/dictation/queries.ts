import { supabase } from '@/lib/supabase/browser';
import type {
  Article,
  FeedbackWithTags,
  Sentence,
  Tag,
} from '@/types/dictation';

type RpcFeedbackTag = {
  id: string;
  created_at: string;
  teacher_feedback_id: string;
  tag_master_id: string | null;
  label: string;
};

type RpcFeedbackWithTags = {
  id: string;
  created_at: string;
  submission_id: string;
  note_md: string;
  tags: RpcFeedbackTag[];
};

type RpcArticle = {
  id: string;
  uid: string;
  title: string;
  created_at: string;
  audio_path_full: string | null;
  collection_id: string;
  journal: { body: string; created_at: string } | null;
  sentences: Array<{
    id: string;
    seq: number;
    content: string;
    created_at: string;
    audio_path: string | null;
    submission: {
      id: string;
      answer: string;
      feedback_md: string | null;
      created_at: string;
      self_assessed_comprehension: number;
    } | null;
    teacher_feedback: RpcFeedbackWithTags[] | null;
  }>;
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
        submission: s.submission,
        teacher_feedback: s.teacher_feedback
          ? (s.teacher_feedback.map(
              (f): FeedbackWithTags => ({
                id: f.id,
                created_at: f.created_at,
                submission_id: f.submission_id,
                note_md: f.note_md,
                tags: (Array.isArray(f.tags) ? f.tags : []) as Tag[],
              })
            ) as FeedbackWithTags[])
          : null,
      })
    ),
  };

  return article;
}
