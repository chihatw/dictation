// app/admin/collections/page.tsx
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

import { Collection } from '@/types/dictation';
import { UserSelect } from '../_components/UserSelect';
import { deleteCollection } from './actions';

export default async function Page(props: {
  searchParams: Promise<{ user_id?: string }>;
}) {
  const sp = await props.searchParams;
  const selectedUserId = sp.user_id ?? '';

  const supabase = await createClient();

  // users
  const { data: users, error: ue } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });
  if (ue) throw new Error(ue.message);

  // collections: ユーザー未選択なら空配列
  const cols: Pick<Collection, 'id' | 'created_at' | 'title' | 'user_id'>[] =
    selectedUserId
      ? (
          await supabase
            .from('dictation_article_collections')
            .select('id, created_at, user_id, title')
            .eq('user_id', selectedUserId) // 絞り込み
            .order('created_at', { ascending: false })
        ).data ?? []
      : [];

  const nameByUid = new Map(users!.map((u) => [u.uid, u.display]));

  return (
    <div className='space-y-4 max-w-3xl mx-auto pb-6'>
      <h1 className='text-xl font-semibold'>ユーザー別課題一覧</h1>

      <div className='flex gap-3 items-end'>
        <UserSelect users={users} selectedUserId={selectedUserId} />
        <Link
          href={`/admin/collections/new${
            selectedUserId ? `?user_id=${selectedUserId}` : ''
          }`}
          className='ml-auto rounded-md border px-4 h-10 flex items-center hover:bg-gray-50'
        >
          新規作成
        </Link>
      </div>

      {selectedUserId ? (
        <div className='divide-y rounded-md border'>
          {cols.length > 0 ? (
            cols.map((col) => (
              <div
                key={col.id}
                className='flex flex-wrap items-center justify-between gap-3 px-3 py-2'
              >
                <div>
                  <div className='font-medium flex items-center gap-1'>
                    {col.title}
                  </div>
                  <div className='text-xs text-gray-500'>
                    {nameByUid.get(col.user_id) ?? col.user_id} ・{' '}
                    {new Date(col.created_at).toLocaleString('ja-JP')}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <Link
                    href={`/admin/articles?collection_id=${col.id}&user_id=${selectedUserId}`}
                    className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
                  >
                    文章一覧
                  </Link>
                  <Link
                    href={`/admin/collections/${col.id}?user_id=${selectedUserId}`}
                    className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
                  >
                    タイトル編集
                  </Link>
                  <form action={deleteCollection}>
                    <input type='hidden' name='id' value={col.id} />
                    <button
                      type='submit'
                      className='rounded-md border border-red-300 px-2 py-1 text-sm text-red-600 hover:bg-red-50'
                    >
                      削除
                    </button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <div className='px-3 py-6 text-sm text-gray-500'>データなし</div>
          )}
        </div>
      ) : (
        <p className='text-sm text-gray-500'>ユーザーを選択してください。</p>
      )}
    </div>
  );
}
