import { MVJPicker } from '@/app/mvjs/[id]/MVJPicker';
import { createClient } from '@/lib/supabase/server';
import { ClozeSpan, Journal, SelfAward } from '@/types/dictation';
import { notFound } from 'next/navigation';
import { JOURNALS_DUMMY, MVJ_DUMMY } from '../dummy';

type Props = { params: Promise<{ id: string }> };

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

const COLUMNS = `
  id,
  window_start,
  window_end,
  user_id,
  title,
  due_at
`;

const Page = async ({ params }: Props) => {
  const { id } = await params;

  if (!id) return notFound();

  const supabase = await createClient();

  const fetchMvj = DEBUG
    ? async () => {
        console.log('no fetch');
        return { data: MVJ_DUMMY } as const;
      }
    : async () => {
        return await supabase
          .from('dictation_mvjs')
          .select(COLUMNS)
          .eq('id', id)
          .single();
      };
  const { data: mvj } = await fetchMvj();

  if (!mvj) return notFound();

  const { data } = DEBUG
    ? { data: JOURNALS_DUMMY }
    : await supabase
        .from('dictation_journals_view')
        .select(
          `
      id,
      created_at,
      article_id,
      body,
      rating_score,
      self_award,
      cloze_spans
      `
        )
        .eq('user_id', mvj.user_id)
        .gte('due_at', mvj.window_start)
        .lte('due_at', mvj.window_end);

  const items: Pick<
    Journal,
    | 'id'
    | 'created_at'
    | 'article_id'
    | 'body'
    | 'rating_score'
    | 'self_award'
    | 'cloze_spans'
  >[] = data
    ? data.map((i) => ({
        id: i.id as string,
        created_at: i.created_at as string,
        article_id: i.article_id as string,
        body: i.body as string,
        rating_score: i.rating_score as number,
        self_award: i.self_award as SelfAward,
        cloze_spans: i.cloze_spans as ClozeSpan[],
      }))
    : [];

  const dueAt = new Date(mvj.due_at);
  const fmtDate = (iso: Date) =>
    iso.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'narrow',
      timeZone: 'Asia/Taipei',
    });

  const fmtTime = (iso: Date) =>
    iso.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Taipei',
    });

  return (
    <div>
      <div className='mx-auto max-w-6xl mt-10 px-4'>
        <h1 className='font-bold text-2xl'>{mvj.title}</h1>
        <div>{fmtDate(dueAt)}</div>
        <div>{fmtTime(dueAt)}</div>
      </div>
      <MVJPicker items={items} />
    </div>
  );
};

export default Page;
