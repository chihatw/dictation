// app/admin/articles/[id]/edit/page.tsx
import { createClientAction } from '@/lib/supabase/server-action';
import { notFound } from 'next/navigation';
import { EditSubtitleForm } from '../../_components/EditSubtitleForm';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function Page(props: PageProps) {
  const { id } = await props.params;
  await props.searchParams;

  const supabase = await createClientAction();
  const { data: art, error } = await supabase
    .from('dictation_articles')
    .select('id, subtitle')
    .eq('id', id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!art) return notFound();

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>article 編集</h1>
      <EditSubtitleForm id={art.id} defaultSubtitle={art.subtitle} />
    </div>
  );
}
