// ユーザー毎に表示を変更するので、動的レンダリングを強制
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  // middleware で非ログインユーザーは弾かれる想定
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('dictation_articles')
    .select('id, title, created_at')
    .eq('uid', user!.id)
    .order('created_at', { ascending: true });

  const articles = data ?? [];

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>聽力練習</h1>

        {error && (
          <p className='rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
            取得に失敗しました。しばらくしてから再度お試しください。
          </p>
        )}

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
