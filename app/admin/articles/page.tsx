// 動的レンダリングを強制
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

type Row = {
  id: string;
  uid: string;
  title: string;
  created_at: string;
};

const AdminArticlesPage = async () => {
  const supabase = await createClient();

  // ビューから取得。表示順は uid→created_at の昇順
  const { data, error } = await supabase
    .from('dictation_articles_recent10')
    .select('id, uid, title, created_at')
    .order('uid', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error(error);
    return <div className='p-6'>読み込みでエラーが発生しました。</div>;
  }

  const rows = (data ?? []) as Row[];

  // uid ごとにグループ化
  const groups = rows.reduce<Record<string, Row[]>>((acc, r) => {
    (acc[r.uid] ||= []).push(r);
    return acc;
  }, {});

  const uids = Object.keys(groups);

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-6 max-w-3xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>各ユーザーの直近10件</h1>

        {uids.length === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            データがありません。
          </div>
        ) : (
          <div className='space-y-8'>
            {uids.map((uid) => (
              <section key={uid} className='space-y-2'>
                <h2 className='text-sm font-semibold text-gray-700'>
                  UID: <span className='font-mono'>{uid}</span>
                </h2>
                <ul className='space-y-2'>
                  {groups[uid].map((a) => (
                    <li
                      key={a.id}
                      className='rounded border p-3 hover:bg-gray-50'
                    >
                      <Link href={`/articles/${a.id}`} className='block'>
                        <div className='flex items-center gap-3'>
                          <div className='flex-1 min-w-0'>
                            <div className='truncate font-medium'>
                              {a.title}
                            </div>
                            <div className='text-xs text-gray-500'>
                              {new Date(a.created_at).toLocaleString()}
                            </div>
                          </div>
                          <ChevronRight className='h-4 w-4 shrink-0' />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminArticlesPage;
