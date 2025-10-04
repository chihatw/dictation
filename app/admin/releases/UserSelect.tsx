'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserSelect({
  users,
  selectedUserId,
}: {
  users: { uid: string; display: string }[];
  selectedUserId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const uid = e.target.value;
    const next = new URLSearchParams(sp);
    if (uid) next.set('user_id', uid);
    else next.delete('user_id');
    router.replace(
      `${pathname}${next.toString() ? `?${next.toString()}` : ''}`
    );
  }

  return (
    <label className='space-y-1'>
      <div className='text-sm text-gray-600'>User</div>
      <select
        name='user_id'
        value={selectedUserId ?? ''}
        onChange={onChange}
        className='border rounded-md px-3 py-2'
      >
        <option value=''>-- select user --</option>
        {users.map((u) => (
          <option key={u.uid} value={u.uid}>
            {u.display} ({u.uid.slice(0, 8)})
          </option>
        ))}
      </select>
    </label>
  );
}
