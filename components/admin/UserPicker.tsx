'use client';

import { supabase } from '@/lib/supabase/browser';
import { useEffect, useState } from 'react';

type UserRow = {
  uid: string;
  display: string;
  created_at: string;
};

export function UserPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (uid: string | null) => void;
}) {
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    let aborted = false;
    (async () => {
      const { data, error } = await supabase
        .from('users')
        .select('uid, display, created_at')
        .order('created_at', { ascending: true });

      if (aborted) return;
      setUsers(error ? [] : data ?? []);
    })();
    return () => {
      aborted = true;
    };
  }, []);

  return (
    <select
      value={value ?? ''} // null のときは '' にマップ
      onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      className='w-full border border-gray-300 rounded px-3 py-2'
    >
      <option value=''>- 選択してください -</option>
      {users.map((u) => (
        <option key={u.uid} value={u.uid}>
          {u.display}（{u.uid.slice(0, 8)}…）
        </option>
      ))}
    </select>
  );
}
