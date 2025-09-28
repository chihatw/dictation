// ユーザー毎に表示を変更するので、動的レンダリングを強制
export const dynamic = 'force-dynamic';

import Journal from '@/components/journal/Journal';
import { Tags } from '@/components/tag/Tags';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();

  // 認証済み前提（middlewareで非ログインを排除）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.rpc('get_release_article_tags', {
    p_uid: user!.id,
  });

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>聽力練習</h1>

        {(!data || data.map.length) === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            まだ記事がありません。
          </div>
        ) : (
          <ul className='space-y-2'>
            {data?.map((t) => (
              <li key={t.id} className='rounded border p-3 hover:bg-gray-50'>
                <Link href={`/articles/${t.id}`} className='block '>
                  <div className='flex items-center'>
                    <div className='flex-1 truncate font-medium'>{t.title}</div>
                    <ChevronRight className='h-4 w-4 shrink-0' />
                  </div>

                  {t.tags.length > 0 && <Tags items={t.tags} />}
                  {t.journal_body && (
                    <Journal
                      body={t.journal_body}
                      created_at={t.journal_created_at}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
