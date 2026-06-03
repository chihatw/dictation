import { createClient } from '@/lib/supabase/server';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AssignmentForm from '../../AssignmentForm';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_assignments')
    .select(
      `
    id,title,profiles(display),dictation_lessons(due_at)
    `,
    )
    .eq('lesson_id', id);
  if (error) throw new Error(error.message);

  const assignments = data.map((ass) => ({
    id: ass.id,
    title: ass.title,
    display: ass.profiles.display,
    due_at: ass.dictation_lessons.due_at,
  }));

  const assignment = assignments[0];

  const dueAt = assignment?.due_at ? new Date(assignment.due_at) : null;

  if (!dueAt) throw new Error('Due date not found');

  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('user_id,display');

  if (usersError) throw new Error(usersError.message);

  return (
    <div className='mx-auto max-w-xl px-4 py-6'>
      <Link
        href='/admin/lessons'
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>レッスン一覧</span>
      </Link>
      <h1 className='mb-6 text-2xl font-semibold flex items-center gap-2'>
        <Calendar />
        <span>
          {dueAt.toLocaleString('ja-JP', {
            month: 'long',
            day: '2-digit',
            weekday: 'short',
            hour: '2-digit',
            timeZone: 'Asia/Tokyo',
          })}
        </span>
        <span>ユーザー別課題作成</span>
      </h1>
      <div className='space-y-2 max-w-xl mx-auto pb-6'>
        <AssignmentForm users={users} lessonId={id} />
      </div>
    </div>
  );
}
