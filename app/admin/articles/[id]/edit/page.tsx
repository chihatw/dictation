// app/admin/articles/[id]/edit/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditSubtitleForm } from '../../_components/EditSubtitleForm';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  await props.searchParams;

  const supabase = await createClient();
  const { data: art, error } = await supabase
    .from('dictation_articles')
    .select('id, subtitle, collection_id')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!art) return notFound();

  return (
    <div className='space-y-6'>
      <div>
        <Link
          href={`/admin/articles?collection_id=${art.collection_id}`}
          className='underline hover:opacity-80'
        >
          コレクションの記事一覧に戻る
        </Link>
      </div>
      <h1 className='text-xl font-semibold'>subtitle 編集</h1>
      <EditSubtitleForm
        id={art.id}
        defaultSubtitle={art.subtitle}
        collectionId={art.collection_id}
      />
    </div>
  );
}
