import { MVJPicker } from '@/app/mvjs/[id]/components/MVJPicker';
import { createClient } from '@/lib/supabase/server';
import { ClozeSpan, Journal, SelfAward } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fmtDate, fmtTime } from './utils';

type Props = { params: Promise<{ id: string }> };

const Page = async ({ params }: Props) => {
  const { id } = await params;

  if (!id) return notFound();

  const supabase = await createClient();

  const fetchMvj = async () => {
    return await supabase
      .from('dictation_mvjs')
      .select('*')
      .eq('id', id)
      .single();
  };
  const { data: mvj } = await fetchMvj();

  if (!mvj) return notFound();

  const { data } = await supabase
    .from('dictation_journals_view')
    .select(
      `
      id,
      created_at,
      article_id,
      body,
      rating_score,
      self_award,
      cloze_spans,
      locked
      `,
    )
    .eq('user_id', mvj.user_id)
    .gte('due_at', mvj.window_start)
    .lte('due_at', mvj.window_end);

  const items: Journal[] = data
    ? data.map((i) => ({
        id: i.id as string,
        created_at: i.created_at as string,
        article_id: i.article_id as string,
        body: i.body as string,
        rating_score: i.rating_score as number,
        self_award: i.self_award as SelfAward,
        cloze_spans: i.cloze_spans as ClozeSpan[],
        locked: i.locked as boolean,
      }))
    : [];

  const dueAt = new Date(mvj.due_at);

  return (
    <div>
      <div className='mx-auto max-w-6xl mt-2 px-4'>
        <div className='py-4'>
          <Link
            href='/'
            className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
          >
            <ChevronLeft className='h-4 w-4' /> 返回首頁
          </Link>
        </div>
        <h1 className='font-bold text-2xl pl-2'>{mvj.title}</h1>
        <div className='text-sm text-slate-500 p-2 pt-1'>
          <div className='flex items-baseline'>
            <div className='pr-2'>截止日期:</div>
            <div className='font-bold text-slate-700 text-base tracking-tighter'>
              {fmtDate(dueAt)}
            </div>
            <div>{`凌晨${fmtTime(dueAt)}。`}</div>
          </div>
          <div>截止前皆可修改選擇。</div>
        </div>
      </div>
      <MVJPicker mvj={mvj} items={items} />
    </div>
  );
};

export default Page;
