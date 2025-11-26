// app/admin/assignments/ConfirmDeleteForm.tsx
'use client';

import { AppWindow } from 'lucide-react';
import { FormEvent } from 'react';
import { deleteAssignment } from './actions'; // actions.ts 先頭に 'use server' が必要

export function ConfirmDeleteForm({ id }: { id: string }) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const ok = confirm('本当に削除しますか？この操作は取り消せません。');
    if (!ok) e.preventDefault();
  };

  return (
    <form action={deleteAssignment} onSubmit={onSubmit}>
      <input type='hidden' name='id' value={id} />
      <button
        type='submit'
        className='rounded-md border border-red-300 px-2 py-1 text-sm text-red-600 hover:bg-red-50 flex items-center gap-1.5'
      >
        <span>削除</span>
        <AppWindow className='w-4 h-4' />
      </button>
    </form>
  );
}
