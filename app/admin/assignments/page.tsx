// app/admin/assignments/page.tsx
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

import { Assignment } from '@/types/dictation';
import { LinkIcon } from 'lucide-react';
import { UserSelect } from '../components/UserSelect';
import { publishAssignment, unpublishAssignment } from './actions';
import { ConfirmDeleteForm } from './ConfirmDeleteForm';

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

  // assignments: ユーザー未選択なら空配列
  const cols: Assignment[] = selectedUserId
    ? (
        await supabase
          .from('dictation_assignments')
          .select('*')
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
          href={`/admin/assignments/new${
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
                  <div className='font-medium'>
                    <Link
                      href={`/admin/articles?assignment_id=${col.id}&user_id=${selectedUserId}`}
                      className='underline underline-offset-2 flex items-center gap-1.5'
                    >
                      <span>{col.title}</span>
                      <LinkIcon className='h-3 w-3 text-slate-700' />
                    </Link>
                  </div>
                  <div className='text-xs text-gray-500'>
                    {nameByUid.get(col.user_id) ?? col.user_id} ・{' '}
                    {new Date(col.created_at).toLocaleString('ja-JP', {
                      timeZone: 'Asia/Tokyo',
                    })}
                    {col.due_at && (
                      <>
                        {' ・ due_at '}
                        {new Date(col.due_at).toLocaleString('ja-JP', {
                          month: 'long',
                          day: '2-digit',
                          hour: '2-digit',
                          timeZone: 'Asia/Tokyo',
                        })}
                      </>
                    )}
                  </div>
                </div>

                <div className='flex items-center gap-2'>
                  <div>
                    {col.published_at ? (
                      <form action={unpublishAssignment}>
                        <input type='hidden' name='id' value={col.id} />
                        <button
                          type='submit'
                          className='rounded-md border px-2 py-1 text-sm  hover:bg-gray-50'
                        >
                          非公開
                        </button>
                      </form>
                    ) : (
                      <form action={publishAssignment}>
                        <input type='hidden' name='id' value={col.id} />
                        <button
                          type='submit'
                          className='rounded-md border px-2 py-1 text-sm  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-100'
                          disabled={!col.due_at}
                        >
                          {col.due_at ? '公開' : 'due_at null'}
                        </button>
                      </form>
                    )}
                  </div>
                  <Link
                    href={`/admin/assignments/${col.id}?user_id=${selectedUserId}`}
                    className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
                  >
                    due_at 編集
                  </Link>

                  <ConfirmDeleteForm id={col.id} />
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
