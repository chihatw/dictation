import { createClient } from '@/lib/supabase/server';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AssignmentForm from '../AssignmentForm';
import { createAssignment } from '../actions';

export default async function Page(props: {
  searchParams: Promise<{ user_id?: string }>;
}) {
  const sp = await props.searchParams;
  const user_id = sp.user_id ?? null;
  if (!user_id) throw new Error('user_id is required in URL params.');

  const supabase = await createClient();
  const { data: user, error } = await supabase
    .from('users')
    .select('uid, display')
    .eq('uid', user_id)
    .single();
  if (error) throw new Error(error.message);

  return (
    <div className='space-y-4'>
      <Link
        href={`/admin/assignments?user_id=${user.uid}`}
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>課題一覧</span>
      </Link>
      <h2 className='text-xl font-medium'>課題作成</h2>
      <AssignmentForm
        defaultValues={{ user_id: user.uid }}
        action={createAssignment}
        submitLabel='作成'
        userDisplay={user.display}
      />
    </div>
  );
}
