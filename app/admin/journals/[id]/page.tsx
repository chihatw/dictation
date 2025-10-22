import { createClient } from '@/lib/supabase/server';
import { Journal } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ClozeSpansForm from './ClozeSpansForm';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assignment_id?: string; user_id?: string }>;
};

const Page = async (props: Props) => {
  const { id } = await props.params;
  const sp = await props.searchParams;
  const { assignment_id: assignmentId, user_id: userId } = sp;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_journals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) console.log(error.message);

  if (!data) return <div>no data</div>;

  return (
    <div className='max-w-2xl mx-auto my-10 mb-96'>
      <div className='mb-4 flex'>
        {!!assignmentId && !!userId && (
          <Link
            href={`/admin/articles?assignment_id=${assignmentId}&user_id=${userId}`}
            className='rounded border py-1 px-1 text-sm flex items-center'
          >
            <ChevronLeft className='inline h-4 w-4' />
            課題文章一覧
          </Link>
        )}
      </div>
      <h1 className='text-4xl font-extrabold mb-4'>Cloze Spans 編集</h1>
      <ClozeSpansForm
        journal={data as Journal}
        assignmentId={assignmentId}
        userId={userId}
      />
    </div>
  );
};

export default Page;
