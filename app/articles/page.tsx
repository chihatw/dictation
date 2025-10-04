// ユーザー毎に表示を変更するので、動的レンダリングを強制
export const dynamic = 'force-dynamic';

import Journal from '@/components/journal/Journal';
import { Tags } from '@/components/tag/Tags';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function ArticlesPage() {
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
        <h1 className='text-xl font-semibold'>{data?.[0]?.title}</h1>

        {(!data || data.map.length) === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            まだ記事がありません。
          </div>
        ) : (
          <ul className='space-y-2'>
            {data?.map((t) => (
              <li key={t.id} className='rounded border p-3 '>
                <Link href={`/articles/${t.id}`} className='block'>
                  <div className='flex items-center hover:underline'>
                    <div className='flex-1 truncate font-medium'>
                      {t.subtitle}
                    </div>
                    <ChevronRight className='h-4 w-4 shrink-0' />
                  </div>
                </Link>

                {t.tags.length > 0 && (
                  <div className='mt-1 '>
                    <Tags items={t.tags} />
                  </div>
                )}

                {t.journal_body && (
                  <div className='mt-2 '>
                    <Journal
                      body={t.journal_body}
                      created_at={t.journal_created_at}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
