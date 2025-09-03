// app/admin/releases/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import { createRelease, publishRelease } from './actions';

export default async function Page() {
  // ユーザー一覧（email表示用, 10件未満想定）
  const { data: usersRes, error: usersErr } =
    await supabaseAdmin.auth.admin.listUsers();
  if (usersErr) throw usersErr;
  const users = usersRes.users ?? [];

  // リリース一覧（created_at降順10件）
  const { data: releases, error: relErr } = await supabaseAdmin
    .from('dictation_releases')
    .select('id, created_at, uid, published_at, due_at')
    .order('created_at', { ascending: false })
    .limit(10);
  if (relErr) throw relErr;

  // email表示用の辞書
  const emailById = new Map<string, string>();
  for (const u of users) emailById.set(u.id, u.email ?? u.id);

  // server actions バインド
  async function onCreate(formData: FormData) {
    'use server';
    const uid = String(formData.get('uid') || '');
    const dueAtJst = (formData.get('due_at') as string) || null; // 'YYYY-MM-DDTHH:mm'
    if (!uid) throw new Error('uid is required');
    await createRelease({ uid, dueAtJst });
  }

  async function onPublish(formData: FormData) {
    'use server';
    const id = String(formData.get('id') || '');
    if (!id) throw new Error('id is required');
    await publishRelease(id);
  }

  return (
    <div className='p-6 space-y-8'>
      {/* 新規作成 */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>新規作成</h2>
        <form action={onCreate} className='flex flex-col gap-3 max-w-xl'>
          <label className='flex flex-col gap-1'>
            <span className='text-sm'>対象ユーザー</span>
            <select
              name='uid'
              className='border rounded px-3 py-2'
              required
              defaultValue={''}
            >
              <option value='' disabled>
                選択してください
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email ?? u.id}
                </option>
              ))}
            </select>
          </label>

          <label className='flex flex-col gap-1'>
            <span className='text-sm'>提出期限（JST, 任意）</span>
            <input
              name='due_at'
              type='datetime-local'
              className='border rounded px-3 py-2'
            />
          </label>

          <button
            type='submit'
            className='px-4 py-2 rounded bg-black text-white'
          >
            作成
          </button>
        </form>
      </section>

      {/* 一覧（公開・下書き混在） */}
      <section className='space-y-4'>
        <h2 className='text-xl font-semibold'>リリース一覧</h2>
        <div className='border rounded'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left p-2'>ID</th>
                <th className='text-left p-2'>ユーザー</th>
                <th className='text-left p-2'>作成</th>
                <th className='text-left p-2'>公開</th>
                <th className='text-left p-2'>期限</th>
                <th className='text-left p-2'>操作</th>
              </tr>
            </thead>
            <tbody>
              {releases?.map((r) => (
                <tr key={r.id} className='border-t'>
                  <td className='p-2'>
                    <Link
                      href={`/admin/releases/${r.id}`}
                      className='underline'
                    >
                      {r.id.slice(0, 8)}
                    </Link>
                  </td>
                  <td className='p-2'>{emailById.get(r.uid) ?? r.uid}</td>
                  <td className='p-2'>
                    {new Date(r.created_at).toLocaleString('ja-JP', {
                      timeZone: 'Asia/Tokyo',
                    })}
                  </td>
                  <td className='p-2'>
                    {r.published_at
                      ? new Date(r.published_at).toLocaleString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                        })
                      : '未公開'}
                  </td>
                  <td className='p-2'>
                    {r.due_at
                      ? new Date(r.due_at).toLocaleString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                        })
                      : '—'}
                  </td>
                  <td className='p-2'>
                    <div className='flex gap-2'>
                      <Link
                        href={`/admin/releases/${r.id}`}
                        className='px-3 py-1 rounded border'
                      >
                        詳細
                      </Link>

                      {!r.published_at && (
                        <form action={onPublish}>
                          <input type='hidden' name='id' value={r.id} />
                          <button
                            type='submit'
                            className='px-3 py-1 rounded bg-blue-600 text-white'
                          >
                            公開
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {(!releases || releases.length === 0) && (
                <tr>
                  <td className='p-4 text-gray-500' colSpan={6}>
                    リリースはありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
