'use client';

import { LoaderCircle, SquareArrowOutUpRight } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { createLesson } from './actions';

const pad = (n: number) => String(n).padStart(2, '0');

function defaultInputValueAt19JST() {
  const now = new Date();

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T19:00`;
}

export default function LessonForm() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createLesson(formData);
      } catch (e) {
        console.error(e);
      }
    });
  };
  return (
    <div>
      <form action={handleSubmit} className='flex items-center gap-2'>
        <input
          type='datetime-local'
          name='due_at'
          defaultValue={defaultInputValueAt19JST()}
          className='flex-1 rounded-md border px-3 py-2'
        />
        <div>
          <button
            type='submit'
            className='flex items-center gap-2 rounded-md border px-3 py-2 bg-black text-white hover:cursor-pointer hover:bg-gray-800 disabled:bg-gray-300'
            disabled={isPending}
          >
            新規作成
            {isPending && <LoaderCircle className='h-4 w-4 animate-spin' />}
          </button>
        </div>
      </form>
      <div className='text-sm text-gray-500 mt-1 flex items-center gap-1'>
        <p className='flex-1 '>※ 日付は日本時間</p>
        <Link
          href='https://supabase.com'
          target='_blank'
          rel='noopener noreferrer'
          title='変更・削除はSupabaseの管理画面で'
        >
          Supabase Web <SquareArrowOutUpRight className='h-4 w-4 inline ml-1' />
        </Link>
      </div>
    </div>
  );
}
