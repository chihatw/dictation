import { createClient } from '@/lib/supabase/server';
import { Calendar, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AssignmentForm from './AssignmentForm';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_lessons')
    .select('due_at')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('lesson not found');

  const dueAt = data.due_at ? new Date(data.due_at) : null;

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
