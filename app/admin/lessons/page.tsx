import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Ticket } from 'lucide-react';
import Link from 'next/link';
import { publishLesson, unpublishLesson } from './actions';
import LessonForm from './LessonForm';

export default async function Page() {
  const supabase = await createClient();

  const { data: lessons, error } = await supabase
    .from('dictation_lessons')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);

  return (
    <div className='mx-auto max-w-xl px-4 py-6'>
      <Link
        href='/admin'
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>管理者ページ</span>
      </Link>
      <h1 className='mb-6 text-2xl font-semibold'>レッスン一覧</h1>
      <div className='space-y-2 max-w-xl mx-auto pb-6'>
        <LessonForm />
        <div className='divide-y rounded-md border'>
          {lessons && lessons.length > 0 ? (
            lessons.map((lesson) => {
              const dueAt = new Date(lesson.due_at);
              return (
                <div
                  key={lesson.id}
                  className='flex flex-wrap items-center justify-between gap-3 px-3 py-2'
                >
                  <div className='font-medium flex items-center gap-2'>
                    <Ticket />
                    <span>
                      {dueAt.toLocaleString('ja-JP', {
                        month: 'long',
                        day: '2-digit',
                        weekday: 'short',
                        hour: '2-digit',
                        timeZone: 'Asia/Tokyo',
                      })}
                    </span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    {lesson.published_at ? (
                      <form action={unpublishLesson}>
                        <input type='hidden' name='id' value={lesson.id} />
                        <button
                          type='submit'
                          className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
                        >
                          公開
                        </button>
                      </form>
                    ) : (
                      <form action={publishLesson}>
                        <input type='hidden' name='id' value={lesson.id} />
                        <button
                          type='submit'
                          className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
                        >
                          非公開
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p>レッスンがありません。</p>
          )}
        </div>
      </div>
    </div>
  );
}
