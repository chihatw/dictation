import { createClient } from '@/lib/supabase/server';
import { Article, Assignment, ClozeSpan, Journal } from '@/types/dictation';
import ClozeWorkout from './ClozeWorkout';

type Props = {
  searchParams: Promise<{
    assignment_id?: string;
  }>;
};

export type ClozeWorkoutAssignment = Pick<
  Assignment,
  'id' | 'title' | 'user_id'
>;
export type ClozeWorkoutArticle = Pick<
  Article,
  'id' | 'subtitle' | 'assignment_id' | 'seq'
>;
export type ClozeWorkoutJournal = Journal;

const Page = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const { assignment_id } = sp;

  let journals: ClozeWorkoutJournal[] = [];
  const supabase = await createClient();

  if (!!assignment_id) {
    const { data: _articles } = await supabase
      .from('dictation_articles')
      .select('id, subtitle, assignment_id, seq')
      .eq('assignment_id', assignment_id)
      .order('seq');
    const articles = _articles!;

    const { data: _journals } = await supabase
      .from('dictation_journals')
      .select('*')
      .in(
        'article_id',
        articles.map((a) => a.id)
      )
      .order('created_at');
    journals = _journals!.map((j) => ({
      ...j,
      cloze_spans: j.cloze_spans as ClozeSpan[],
    }));
  }
  return (
    <div className='min-h-screen py-20'>
      <main className='mx-auto max-w-xl'>
        <ClozeWorkout journals={journals} />
      </main>
    </div>
  );
};

export default Page;
