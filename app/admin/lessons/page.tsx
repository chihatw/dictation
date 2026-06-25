import { createClient } from '@/lib/supabase/server';
import {
  Calendar,
  Check,
  ChevronLeft,
  Folder,
  Plus,
  Ticket,
} from 'lucide-react';
import Link from 'next/link';
import { publishLesson, unpublishLesson } from './actions';
import CopyableLessonDate from './CopyableLessonDate';
import LessonForm from './LessonForm';

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('dictation_lessons')
    .select(
      `
    id,
    created_at,
    due_at,
    published_at,
    dictation_assignments (
      id,
      title,
      user_id
    ),
    dictation_tickets (
      id
    )
  `,
    )
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) throw new Error(error.message);

  const userIds = [
    ...new Set(
      data.flatMap((lesson) =>
        lesson.dictation_assignments.map((assignment) => assignment.user_id),
      ),
    ),
  ];

  const profilesByUserId = new Map<string, string>();

  if (userIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id, display')
      .in('user_id', userIds);

    if (profilesError) throw new Error(profilesError.message);

    profiles.forEach((profile) => {
      profilesByUserId.set(profile.user_id, profile.display);
    });
  }

  const lessons = data.map((lesson) => ({
    id: lesson.id,
    created_at: lesson.created_at,
    due_at: lesson.due_at,
    published_at: lesson.published_at,
    hasTicket: lesson.dictation_tickets !== null,
    assignments: lesson.dictation_assignments.map((ass) => ({
      id: ass.id,
      title: ass.title,
      display: profilesByUserId.get(ass.user_id) ?? '不明なユーザー',
    })),
  }));

  return (
    <div className='mx-auto max-w-xl px-4 py-6'>
      <Link
        href='/admin'
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>管理者ページ</span>
      </Link>
      <h1 className='mb-6 text-2xl font-semibold flex items-center gap-2'>
        <Calendar />
        レッスン一覧
      </h1>
      <div className='space-y-2 max-w-xl mx-auto pb-6'>
        <LessonForm />
        <div className='divide-y rounded-md border'>
          {lessons && lessons.length > 0 ? (
            lessons.map((lesson) => {
              const dueAt = new Date(lesson.due_at);
              const dueAtLabel = dueAt.toLocaleString('ja-JP', {
                month: 'long',
                day: '2-digit',
                weekday: 'short',
                hour: '2-digit',
                timeZone: 'Asia/Tokyo',
              });

              return (
                <div
                  key={lesson.id}
                  className='flex flex-wrap items-center justify-between gap-3 px-3 py-2'
                >
                  <div className='flex items-center gap-2'>
                    <span
                      title={
                        lesson.hasTicket ? 'チケット作成済み' : 'チケット未作成'
                      }
                      aria-label={
                        lesson.hasTicket ? 'チケット作成済み' : 'チケット未作成'
                      }
                    >
                      {lesson.hasTicket ? (
                        <Check className='h-5 w-5 ' />
                      ) : (
                        <Ticket className='h-5 w-5 ' />
                      )}
                    </span>
                    <CopyableLessonDate
                      lessonId={lesson.id}
                      label={dueAtLabel}
                    />
                    <Link
                      href={`/admin/lessons/${lesson.id}/new`}
                      className='inline-flex items-center justify-center bg-black text-white rounded p-1'
                      title='ユーザー別課題作成'
                    >
                      <Plus className='h-4 w-4 ' />
                    </Link>
                  </div>
                  <div className='flex items-center gap-2 flex-wrap text-xs'>
                    {lesson.assignments.map((ass) => (
                      <Link
                        key={ass.id}
                        href={`/admin/assignments/${ass.id}`}
                        className='border rounded px-1.5 py-1 hover:bg-gray-50 flex items-center justify-center gap-1'
                        title={ass.title}
                      >
                        <Folder className='w-4 h-4' />
                        <span>{ass.display}</span>
                      </Link>
                    ))}
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
