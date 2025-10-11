import { supabase } from '@/lib/supabase/browser';
import { ArticleWithSentences, Journal } from '@/types/dictation';

export async function fetchArticleWithSentences(articleId: string): Promise<{
  article: ArticleWithSentences;
  journal: Journal | null;
} | null> {
  const { data, error } = await supabase.rpc('get_article_page', {
    p_article_id: articleId,
  });

  if (error || !data) return null;

  const { journal, ...rest } = data as ArticleWithSentences & {
    journal: Journal | null;
  };

  return { article: rest, journal };
}
