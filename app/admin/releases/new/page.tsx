export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createRelease } from '../actions';
import { listCollectionsByUser, listUsers } from '../queries';
import { UserSelect } from './UserSelect';

export default async function Page(props: {
  searchParams: Promise<{ user_id?: string }>;
}) {
  const sp = await props.searchParams;
  const initialUserId = sp.user_id ?? '';
  const users = await listUsers();
  const collections = initialUserId
    ? await listCollectionsByUser(initialUserId)
    : [];

  async function createAction(formData: FormData) {
    'use server';
    const userId = String(formData.get('user_id') || '');
    const collectionId = String(formData.get('collection_id') || '');
    const dueAtLocal = String(formData.get('due_at') || '');
    if (!userId || !collectionId || !dueAtLocal)
      throw new Error('missing fields');
    const dueAtIso = new Date(dueAtLocal).toISOString();
    await createRelease({ userId, collectionId, dueAtIso });
    redirect(`/admin/releases?user_id=${userId}`);
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='p-6 space-y-6'>
        <h1 className='text-xl font-semibold'>New Release</h1>

        {/* ユーザー選択（即時URL反映） */}
        <div className='flex gap-3 items-end'>
          <UserSelect users={users} selectedUserId={initialUserId} />
          <Link
            href={`/admin/releases${
              initialUserId ? `?user_id=${initialUserId}` : ''
            }`}
            className='ml-auto border rounded-md px-4 h-10 flex items-center'
          >
            戻る
          </Link>
        </div>

        {/* 作成フォーム */}
        {initialUserId ? (
          <form action={createAction} className='space-y-4'>
            <input type='hidden' name='user_id' value={initialUserId} />

            <div className='space-y-1'>
              <div className='text-sm text-gray-600'>Collection</div>
              <select
                name='collection_id'
                required
                className='border rounded-md px-3 py-2 w-full'
                defaultValue=''
              >
                <option value='' disabled>
                  -- select collection --
                </option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-1'>
              <div className='text-sm text-gray-600'>Due</div>
              <input
                type='datetime-local'
                name='due_at'
                required
                className='border rounded-md px-3 py-2'
              />
            </div>

            <div className='flex gap-3'>
              <button className='border rounded-md px-4 h-10' type='submit'>
                作成
              </button>
              <Link
                href={`/admin/releases${
                  initialUserId ? `?user_id=${initialUserId}` : ''
                }`}
                className='border rounded-md px-4 h-10 flex items-center'
              >
                キャンセル
              </Link>
            </div>
          </form>
        ) : (
          <p className='text-sm text-gray-500'>ユーザーを選択してください。</p>
        )}
      </div>
    </div>
  );
}
