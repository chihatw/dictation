import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, Folder } from 'lucide-react';
import Link from 'next/link';
import ArticleForm from './ArticleForm';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) throw new Error('id is required');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('dictation_assignments')
    .select(
      `
      title,
      profiles(
        display
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  if (!data) throw new Error('assignment not found');

  const {
    title,
    profiles: { display },
  } = data;

  return (
    <div className='mx-auto max-w-xl px-4 py-6'>
      <Link
        href={`/admin/assignments/${id}`}
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>原稿一覧</span>
      </Link>
      <h1 className='text-2xl font-semibold mb-2'>
        <div className='flex items-center gap-2 '>
          <Folder />
          <div className='flex items-center gap-2'>{`${display} ${title}`}</div>
        </div>
        <div>ディクテーション原稿作成</div>
      </h1>
      <ArticleForm assignment_id={id} />
    </div>
  );
}
