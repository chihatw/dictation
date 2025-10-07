// ユーザー選択 → リリース一覧 + 公開ボタン
export const dynamic = 'force-dynamic';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { UserSelect } from '../_components/UserSelect';
import { deleteRelease, publishRelease } from './actions';
import { ConfirmSubmitButton } from './ConfirmSubmitButton';
import { listReleasesByUser, listUsers } from './queries';

export default async function Page(props: {
  searchParams: Promise<{ user_id?: string }>;
}) {
  const sp = await props.searchParams;
  const users = await listUsers();
  const selectedUserId = sp.user_id ?? '';
  const releases = selectedUserId
    ? await listReleasesByUser(selectedUserId)
    : [];

  async function publishAction(formData: FormData) {
    'use server';
    const rid = String(formData.get('release_id') || '');
    if (!rid) throw new Error('missing release_id');
    await publishRelease(rid);
  }

  async function deleteAction(formData: FormData) {
    'use server';
    const rid = String(formData.get('release_id') || '');
    if (!rid) throw new Error('missing release_id');
    await deleteRelease(rid);
  }

  return (
    <div className='max-w-3xl mx-auto'>
      <div className='p-6 space-y-6'>
        <Link
          href='/admin'
          className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-4'
        >
          <ChevronLeft className='h-4 w-4' />
          <span>管理者ページ</span>
        </Link>

        <h1 className='text-xl font-semibold'>公開一覧（publish操作・削除）</h1>

        <div className='flex gap-3 items-end'>
          <UserSelect users={users} selectedUserId={selectedUserId} />
          <Link
            href={`/admin/releases/new${
              selectedUserId ? `?user_id=${selectedUserId}` : ''
            }`}
            className='ml-auto border rounded-md px-4 h-10 flex items-center'
          >
            New
          </Link>
        </div>

        {/* 一覧 */}
        {selectedUserId ? (
          <div className='space-y-3'>
            {releases.length === 0 ? (
              <p className='text-sm text-gray-500'>No releases.</p>
            ) : (
              releases.map((r) => (
                <div
                  key={r.id}
                  className='rounded-lg border p-4 flex items-center gap-4'
                >
                  <div className='min-w-44'>
                    <div className='text-xs text-gray-500'>Due</div>
                    <div className='font-medium'>
                      {new Date(r.due_at).toLocaleString('ja-JP', {
                        timeZone: 'Asia/Tokyo',
                      })}
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='text-sm text-gray-500'>
                      {r.user.display}
                    </div>
                    <div className='font-medium'>{r.collection.title}</div>
                  </div>
                  <div className='w-48'>
                    <div className='text-xs text-gray-500'>Published</div>
                    <div className='font-medium'>
                      {r.published_at
                        ? new Date(r.published_at).toLocaleString('ja-JP')
                        : '未公開'}
                    </div>
                  </div>
                  {!r.published_at && (
                    <form action={publishAction}>
                      <input type='hidden' name='release_id' value={r.id} />
                      <button className='border rounded-md px-4 h-10'>
                        公開
                      </button>
                    </form>
                  )}
                  <form action={deleteAction}>
                    <input type='hidden' name='release_id' value={r.id} />
                    <ConfirmSubmitButton className='border rounded-md px-4 h-10'>
                      削除
                    </ConfirmSubmitButton>
                  </form>
                </div>
              ))
            )}
          </div>
        ) : (
          <p className='text-sm text-gray-500'>ユーザーを選択してください。</p>
        )}
      </div>
    </div>
  );
}
