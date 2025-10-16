import { createClient } from '@/lib/supabase/server';
import { ClozeObjLine, ClozeSpan } from '@/types/dictation';
import { makeClozeText, parseCloze } from '@/utils/cloze/converter';
import ArticleCloze from '../ArticleCloze';

const ASSIGNMENT_ID = 'a58a1521-58d5-4ac2-893b-2e19c82b7850';

export default async function Page() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('dictation_assignments')
    .select(`title`)
    .eq('id', ASSIGNMENT_ID)
    .single();

  const { title } = data!;

  const { data: articles } = await supabase
    .from('dictation_articles')
    .select('id, subtitle')
    .eq('assignment_id', ASSIGNMENT_ID)
    .order('seq');

  const journals = await Promise.all(
    articles!.map(async (a) => {
      const { data } = await supabase
        .from('dictation_journals')
        .select('body, cloze_spans')
        .eq('article_id', a.id)
        .single();
      return data!;
    })
  );

  const items: {
    title: string;
    lines: ClozeObjLine[];
  }[] = articles!.map((a, index) => {
    const journal = journals![index];
    const clozeText = makeClozeText(
      journal.body,
      journal.cloze_spans as ClozeSpan[]
    );
    const lines = clozeText.split('\n').filter(Boolean);
    const clozeObjLines = lines.map(parseCloze);
    return {
      title: `${title} ${a.subtitle}`,
      lines: clozeObjLines,
    };
  });

  return (
    <main className='min-h-screen w-full bg-gray-50 mt-10'>
      <div className='mx-auto max-w-screen-2xl p-6 lg:p-8'>
        <div className='flex flex-col gap-6 max-w-2xl mx-auto'>
          {items.map((a) => (
            <ArticleCloze key={a.title} title={a.title} lines={a.lines} />
          ))}
        </div>
      </div>
    </main>
  );
}
