import { createClient } from '@/lib/supabase/server';
import { ClozeSpan } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ClozeSpansForm from './ClozeSpansForm';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<void>;
};

const Page = async (props: Props) => {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_journals')
    .select(
      `
      id,
      body,
      cloze_spans,
      dictation_articles(
        assignment_id
      )
    `,
    )
    .eq('id', id)
    .single();

  if (error) console.log(error.message);
  if (!data || !data.id) throw new Error('Journal not found');
  if (!data.dictation_articles) throw new Error('Related article not found');

  const journal = {
    id: data.id,
    body: data.body,
    cloze_spans: data.cloze_spans as ClozeSpan[],
    assignment_id: data.dictation_articles.assignment_id,
    // user_id: data.dictation_articles.dictation_assignments.user_id,
  };

  return (
    <div className='max-w-2xl mx-auto my-10 mb-96'>
      <div className='mb-4 flex'>
        {!!journal.assignment_id && (
          <Link
            href={`/admin/assignments/${journal.assignment_id}`}
            className='rounded border py-1 px-1 text-sm flex items-center'
          >
            <ChevronLeft className='inline h-4 w-4' />
            課題文章一覧
          </Link>
        )}
      </div>
      <h1 className='text-4xl font-extrabold mb-4'>Cloze Spans 編集</h1>
      <ClozeSpansForm {...journal} />
    </div>
  );
};

export default Page;
