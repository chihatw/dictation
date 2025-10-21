import { createClient } from '@/lib/supabase/server';
import { Journal } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ClozeSpansUserForm from './ClozeSpansUserForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_journals')
    .select('*')
    .eq('id', id)
    .eq('locked', false)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return notFound();
  return (
    <div className='min-h-screen'>
      <div className='mx-auto max-w-xl py-3'>
        <Link
          href='/'
          className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50 mb-6'
        >
          <ChevronLeft className='h-4 w-4' /> 返回首頁
        </Link>
        <h1 className='text-4xl font-bold mb-4'>
          {!(data as Journal).cloze_spans.length ? `建立填空題` : `修改填空題`}
        </h1>
        <ClozeSpansUserForm journal={data as Journal} />
      </div>
    </div>
  );
}
