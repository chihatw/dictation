// app/admin/articles/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCreateForm } from '../components/ArticleCreateForm';

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function Page(props: PageProps) {
  await props.params;
  const sp = await props.searchParams;
  const assignmentId =
    typeof sp.assignment_id === 'string' ? sp.assignment_id : '';

  if (!assignmentId) return notFound();

  const supabase = await createClient();
  const { data: col, error } = await supabase
    .from('dictation_assignments')
    .select('id, title')
    .eq('id', assignmentId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!col) return notFound();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>{col.title} Article 新規作成</h1>
        <Link
          href={`/admin/articles?assignment_id=${col.id}`}
          className='text-sm underline hover:no-underline'
        >
          戻る
        </Link>
      </div>
      <ArticleCreateForm assignmentId={col.id} />
    </div>
  );
}
