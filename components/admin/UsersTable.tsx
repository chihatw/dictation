'use client';

import { User } from '@supabase/supabase-js';
import { useOptimistic, useTransition } from 'react';

export default function UsersTable({
  initialUsers,
  grantAdmin,
  revokeAdmin,
}: {
  initialUsers: User[];
  grantAdmin: (uid: string) => Promise<void>;
  revokeAdmin: (uid: string) => Promise<void>;
}) {
  const [, start] = useTransition();
  const [optimisticUsers, setOptimistic] = useOptimistic(
    initialUsers,
    (state, upd: Partial<User> & { id: string }) =>
      state.map((u) => (u.id === upd.id ? { ...u, ...upd } : u))
  );
  const onGrant = (uid: string) => {
    start(async () => {
      setOptimistic({ id: uid, role: 'admin' }); // ← トランジション内
      try {
        await grantAdmin(uid); // サーバーアクション
      } catch {
        setOptimistic({ id: uid, role: undefined }); // ロールバックも内側で
      }
    });
  };

  const onRevoke = (uid: string) => {
    start(async () => {
      setOptimistic({ id: uid, role: undefined });
      try {
        await revokeAdmin(uid);
      } catch {
        setOptimistic({ id: uid, role: 'admin' });
      }
    });
  };

  return (
    <table className='min-w-full border border-gray-200 rounded-lg shadow-sm'>
      <thead className='bg-gray-100'>
        <tr>
          <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
            ID
          </th>
          <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
            Email
          </th>
          <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
            Role
          </th>
          <th className='px-4 py-2 text-left text-sm font-semibold text-gray-700'>
            Ops
          </th>
        </tr>
      </thead>
      <tbody>
        {optimisticUsers.map((user) => (
          <tr
            key={user.id}
            className='border-t border-gray-200 hover:bg-gray-50 transition-colors'
          >
            <td
              className='px-4 py-2 text-sm text-gray-800 max-w-[120px] truncate overflow-hidden whitespace-nowrap'
              title={user.id}
            >
              {user.id}
            </td>
            <td className='px-4 py-2 text-sm text-gray-800'>{user.email}</td>
            <td className='px-4 py-2 text-sm'>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  user.app_metadata.role === 'admin'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {user.app_metadata.role ?? 'user'}
              </span>
            </td>
            <td className='px-4 py-2 space-x-2'>
              {user.app_metadata.role !== 'admin' && (
                <button
                  onClick={() => onGrant(user.id)}
                  className='
      px-3 py-1 text-sm font-medium text-white bg-red-600 rounded shadow-sm
      transition-colors focus:outline-none focus:ring-2 focus:ring-red-400
      hover:bg-red-700 cursor-pointer
    '
                >
                  管理者付与
                </button>
              )}

              {user.app_metadata.role === 'admin' && (
                <button
                  onClick={() => onRevoke(user.id)}
                  className='
      px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded shadow-sm
      transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400
      hover:bg-gray-300 cursor-pointer
    '
                >
                  管理者解除
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
