// ユーザー毎に表示を変更するので、動的レンダリングを強制
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

// YYYY/M/D（Asia/Taipei）で整形。タイトルの開始xを固定するため日付欄は固定幅。
function formatYMDTaipei(iso: string) {
  return new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(iso));
}

export default async function Page() {
  const supabase = await createClient();

  // 認証済み前提（middlewareで非ログインを排除）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cols } = await supabase
    .from('dictation_article_collections')
    .select('id, title, created_at')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        {!cols || cols.length === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            まだコレクションがありません。
          </div>
        ) : (
          <ul className='space-y-2'>
            {cols.map((c) => (
              <li key={c.id} className='rounded border p-3 hover:bg-gray-50'>
                <Link href={`/collections/${c.id}`} className='block'>
                  <div className='flex items-center gap-3'>
                    {/* 固定幅で日付。tabular-numsで桁幅を統一 */}
                    <div className='w-18 shrink-0 text-sm text-gray-500 tabular-nums'>
                      {formatYMDTaipei(c.created_at)}
                    </div>
                    {/* タイトルは常に同じxから開始 */}
                    <div className='flex-1 truncate font-medium'>{c.title}</div>
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
