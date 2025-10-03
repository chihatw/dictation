// app/admin/sentences/[id]/teacher_feedback/page.tsx
import { createClientAction } from '@/lib/supabase/server-action';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SentenceAdminPanel from './SentenceAdminPanel';
import type { SentenceAdminData } from './types';

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { id } = await props.params;
  const supabase = await createClientAction();

  const { data, error } = await supabase
    .rpc('get_sentence_admin', { p_sentence_id: id })
    .single<SentenceAdminData>();

  if (error) throw new Error(error.message);
  if (!data) return notFound();

  const sentence = data;

  return (
    <div className='mx-auto max-w-3xl p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>
          短評編集 / {sentence.article.subtitle} / #{sentence.seq}
        </h1>
        <Link
          href={`/articles/${sentence.article.id}`}
          className='text-sm underline '
        >
          ← 記事に戻る
        </Link>
      </div>

      <SentenceAdminPanel sentence={sentence} />
    </div>
  );
}
