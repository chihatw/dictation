'use client';

import { createAssignment } from '@/app/admin/lessons/[id]/new/actions';
import { LoaderCircle } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function AssignmentForm({
  users,
  lessonId,
}: {
  users: { user_id: string; display: string }[];
  lessonId: string;
}) {
  const [userId, setUserId] = useState('');
  const [title, setTitle] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createAssignment(formData);
      } catch (e) {
        console.error(e);
      }
    });
  };

  return (
    <form className='space-y-4' action={handleSubmit}>
      <div className='flex items-end gap-2'>
        <div className='flex-1'>
          <input type='hidden' name='lesson_id' value={lessonId} />
          <div className='space-y-1'>
            <label className='text-sm font-medium'>ユーザー</label>
            <select
              name='user_id'
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className='w-full rounded-md border px-3 py-2'
            >
              <option value=''>ユーザーを選択</option>
              {users.map((user) => (
                <option key={user.user_id} value={user.user_id}>
                  {user.display}
                </option>
              ))}
            </select>
          </div>
          <div className='space-y-1'>
            <label className='text-sm font-medium'>タイトル</label>
            <input
              name='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className='w-full rounded-md border px-3 py-2'
              placeholder='課題名'
            />
          </div>
        </div>
        <button
          type='submit'
          className='flex items-center gap-2 rounded-md px-4 py-2 text-sm bg-black text-white hover:cursor-pointer disabled:bg-gray-300'
          disabled={!(userId && title) || isPending}
        >
          <span>作成</span>
          {isPending && <LoaderCircle className='h-4 w-4 animate-spin' />}
        </button>
      </div>
    </form>
  );
}
