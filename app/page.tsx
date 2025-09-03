// ユーザー毎に表示を変更するので、動的レンダリングを強制
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  // 認証済み前提（middlewareで非ログインを排除）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1) ユーザーの最新公開リリースを1件取得
  const { data: rel, error: relErr } = await supabase
    .from('dictation_releases')
    .select('id, published_at, due_at')
    .eq('uid', user!.id)
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (relErr) {
    console.error(relErr);
  }

  // 2) そのリリースに紐づく記事をpos昇順で取得
  //    dictation_release_items.article_id -> dictation_articles.id
  let articles: { id: string; title: string; created_at: string }[] = [];

  if (rel?.id) {
    const { data: items } = await supabase
      .from('dictation_release_items')
      .select('pos, dictation_articles(id, title, created_at)')
      .eq('release_id', rel.id)
      .order('pos', { ascending: true });

    articles = (items ?? []).map((it) => it.dictation_articles).filter(Boolean);
  }

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>聽力練習</h1>

        {articles.length === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            まだ記事がありません。
          </div>
        ) : (
          <ul className='space-y-2'>
            {articles?.map((t) => (
              <li key={t.id} className='rounded border p-3 hover:bg-gray-50'>
                <Link href={`/articles/${t.id}`} className='block '>
                  <div className='flex items-center'>
                    <div className='flex-1 truncate font-medium'>{t.title}</div>
                    <ChevronRight className='h-4 w-4 shrink-0' />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
