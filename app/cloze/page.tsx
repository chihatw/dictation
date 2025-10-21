import { createClient } from '@/lib/supabase/server';
import { ClozeSpan, Journal } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import AssignmentPicker from './components/AssignmentPicker';
import ClozeWorkout from './components/ClozeWorkout';
import JournalsPicker from './components/JournalsPicker';

type Search = {
  assignment_id?: string;
  journal_ids?: string; // CSV ("id1,id2,...")
  unit?: 'journal' | 'line';
  order?: 'seq' | 'rand';
  month?: string; // due_ym_key, e.g. "2025-10"
};

type Props = { searchParams: Promise<Search> };

const Page = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  // defaults
  const defaultUnit = (
    sp.unit === 'line' || sp.unit === 'journal' ? sp.unit : 'journal'
  ) as 'journal' | 'line';
  const defaultOrder = (
    sp.order === 'rand' || sp.order === 'seq' ? sp.order : 'seq'
  ) as 'seq' | 'rand';

  // --------- 1) month options (distinct due_ym_key, desc) ---------
  const { data: ymRows, error: ymErr } = await supabase.rpc(
    'get_distinct_due_ym_keys'
  );
  if (ymErr) console.error(ymErr);
  const months = (ymRows ?? []).map((r) => r.due_ym_key as string);

  const month = sp.month && months.includes(sp.month) ? sp.month : months[0];

  // --------- 2) assignments in the selected month (asc by due_at) ---------
  const { data: assigns, error: aErr } = await supabase
    .from('dictation_assignments_view')
    .select('id, title, due_at, due_ym_key, is_published')
    .eq('is_published', true)
    .eq('due_ym_key', month)
    .eq('user_id', user.id)
    .order('due_at', { ascending: false });
  if (aErr) console.error(aErr);

  // assignment_id resolve
  const availableAssignmentIds = (assigns ?? []).map((a) => a.id as string);
  const assignment_id =
    sp.assignment_id && availableAssignmentIds.includes(sp.assignment_id)
      ? sp.assignment_id
      : availableAssignmentIds[0];

  // --------- 3) journals list for picker (created_at asc) ---------
  let journals: Journal[] = [];
  let allJournals: Journal[] = [];
  if (assignment_id) {
    const { data: _journals, error: jErr } = await supabase
      .from('dictation_journals_view')
      .select(
        `
        id, 
        created_at, 
        article_id, 
        body, 
        rating_score, 
        cloze_spans, 
        assignment_id, 
        article_seq, 
        locked
      `
      )
      .eq('assignment_id', assignment_id)
      .order('created_at', { ascending: true });
    if (jErr) console.error(jErr);

    const base = _journals ?? [];
    allJournals =
      _journals?.map((j) => ({
        id: j.id as string,
        created_at: j.created_at as string,
        article_id: j.article_id as string,
        body: j.body as string,
        cloze_spans: j.cloze_spans! as ClozeSpan[],
        rating_score: j.rating_score as number,
        locked: j.locked as boolean,
      })) ?? [];

    const pick = (() => {
      if (sp.journal_ids === undefined) {
        // journal_ids 未指定 → 全部
        return base;
      }
      if (sp.journal_ids.trim() === '') {
        // 空 → 空配列
        return [];
      }
      const selectedIds = sp.journal_ids
        .split(',')
        .filter(Boolean)
        .filter((id) => base.map((j) => j.id).includes(id));
      return base.filter((j) => selectedIds.includes(j.id as string));
    })();

    journals = pick.map((j) => ({
      ...j,
      cloze_spans: j.cloze_spans as ClozeSpan[],
    })) as Journal[];
  }

  const defaultAllJournals = sp.journal_ids === undefined;

  return (
    <div className='min-h-screen pt-10 pb-20'>
      <div className='mx-auto max-w-xl mb-4'>
        <Link
          href='/'
          className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
        >
          <ChevronLeft className='h-4 w-4' /> 返回首頁
        </Link>
      </div>
      <main className='mx-auto max-w-xl space-y-6'>
        <Suspense>
          <AssignmentPicker
            months={months}
            month={month}
            assignments={(assigns ?? []).map((a) => ({
              id: a.id as string,
              title: a.title as string,
              due_at: a.due_at as string,
            }))}
            assignmentId={assignment_id}
          />
        </Suspense>
        {assignment_id && (
          <Suspense>
            <JournalsPicker
              assignmentId={assignment_id}
              allJournals={allJournals}
              selectedIds={(
                sp.journal_ids?.split(',').filter(Boolean) ?? []
              ).filter((id) => allJournals.map((j) => j.id).includes(id))}
              defaultAll={defaultAllJournals}
            />
          </Suspense>
        )}
        {!!journals.length && (
          <ClozeWorkout
            journals={journals}
            defaultUnit={defaultUnit}
            defaultOrder={defaultOrder}
          />
        )}
      </main>
    </div>
  );
};

export default Page;
