// app/admin/articles/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCreateForm } from '../_components/ArticleCreateForm';

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function Page(props: PageProps) {
  await props.params;
  const sp = await props.searchParams;
  const collectionId =
    typeof sp.collection_id === 'string' ? sp.collection_id : '';

  if (!collectionId) return notFound();

  const supabase = await createClient();
  const { data: col, error } = await supabase
    .from('dictation_article_collections')
    .select('id, title')
    .eq('id', collectionId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!col) return notFound();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>{col.title} Article 新規作成</h1>
        <Link
          href={`/admin/articles?collection_id=${col.id}`}
          className='text-sm underline hover:no-underline'
        >
          戻る
        </Link>
      </div>
      <ArticleCreateForm collectionId={col.id} />
    </div>
  );
}
