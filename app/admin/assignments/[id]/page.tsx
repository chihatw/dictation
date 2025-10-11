import { createClient } from '@/lib/supabase/server';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AssignmentForm from '../_AssignmentForm';
import { updateAssignment } from '../actions';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ user_id?: string }>;
}) {
  const { id } = await params;

  const sp = await searchParams;
  const user_id = sp.user_id ?? null;
  if (!user_id) throw new Error('user_id is required in URL params.');

  const supabase = await createClient();

  const [{ data: user, error: ue }, { data: col, error: ce }] =
    await Promise.all([
      supabase.from('users').select('uid, display').eq('uid', user_id).single(),
      supabase
        .from('dictation_assignments')
        .select('id, title, user_id')
        .eq('id', id)
        .maybeSingle(),
    ]);

  if (ue) throw new Error(ue.message);
  if (ce) throw new Error(ce.message);
  if (!col) return notFound();

  return (
    <div className='space-y-4'>
      <Link
        href={`/admin/assignments?user_id=${user.uid}`}
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>課題一覧</span>
      </Link>
      <h2 className='text-xl font-medium'>課題タイトル編集</h2>
      <AssignmentForm
        userDisplay={user.display}
        defaultValues={{ id: col.id, title: col.title, user_id: col.user_id }}
        action={updateAssignment}
        submitLabel='保存'
      />
    </div>
  );
}
