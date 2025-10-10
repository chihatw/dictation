import { supabase } from '@/lib/supabase/browser';
import type { Journal, RpcArticle } from '@/types/dictation';

// type RpcArticle = {
//   id: string;
//   uid: string;
//   collection_id: string;
//   title: string; // dictation_articles.subtitle
//   created_at: string;
//   audio_path_full: string | null;
//   journal: {
//     body: string;
//     created_at: string;
//   } | null;
//   sentences: {
//     id: string;
//     seq: number;
//     content: string;
//     created_at: string;
//     audio_path: string | null;
//     submission: {
//       id: string;
//       answer: string;
//       feedback_md: string | null;
//       teacher_feedback: string | null;
//       created_at: string;
//       self_assessed_comprehension: number;
//       tags: {
//         id: string;
//         created_at: string;
//         tag_master_id: string;
//         label: string;
//         submission_id: string;
//       }[];
//       plays_count: number;
//       elapsed_ms_since_item_view: number;
//       elapsed_ms_since_first_play: number;
//     } | null;
//   }[];
// };

export async function fetchArticleWithSentences(articleId: string): Promise<{
  article: RpcArticle;
  journal: Pick<Journal, 'body' | 'created_at'> | null;
} | null> {
  const { data, error } = await supabase.rpc('get_article_page', {
    p_article_id: articleId,
  });

  if (error || !data) return null;

  const { journal, ...rest } = data as RpcArticle & {
    journal: Pick<Journal, 'body' | 'created_at'>; // debug RpcJournal やろ
  };

  return { article: rest, journal };
}
