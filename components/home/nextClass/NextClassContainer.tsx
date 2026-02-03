import { NextClass } from '@/components/home/nextClass/NextClass';
import { NextTask } from '@/components/home/nextClass/NextTask';
import { createClient } from '@/lib/supabase/server';

type QuickWriteItem = { article_id: string; full_title: string };

export const NextClassContainer = async ({ userId }: { userId: string }) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_next_class', {
    p_uid: userId,
  });

  // Home を落とさない：失敗/0行は空カード（0%）扱い
  const row = !error && Array.isArray(data) ? data[0] : null;

  const assignmentId = (row?.assignment_id as string | undefined) ?? '';
  const startAt = (row?.start_at as string | null | undefined) ?? null;
  const dueAt = (row?.due_at as string | null | undefined) ?? null;

  const totalCount = (row?.total_count as number | undefined) ?? 0;
  const doneCount = (row?.done_count as number | undefined) ?? 0;
  const articleCount = (row?.article_count as number | undefined) ?? 0;
  const journalCount = (row?.journal_count as number | undefined) ?? 0;

  const total = totalCount + articleCount;
  const completed = doneCount + journalCount;

  const nextArticleId =
    (row?.next_article_id as string | null | undefined) ?? null;
  const nextFullTitle =
    (row?.next_full_title as string | null | undefined) ?? null;
  const nextSentenceSeq =
    (row?.next_sentence_seq as number | null | undefined) ?? null;

  let quickWriteItem: QuickWriteItem | null = null;
  const qwa =
    (row?.quick_write_article_id as string | null | undefined) ?? null;
  const qwt =
    (row?.quick_write_full_title as string | null | undefined) ?? null;
  if (qwa && qwt) {
    quickWriteItem = { article_id: qwa, full_title: qwt };
  }

  return (
    <>
      <NextClass startAt={startAt} dueAt={dueAt} />
      <NextTask
        total={total}
        completed={completed}
        assignmentId={assignmentId}
        nextFullTitle={nextFullTitle}
        nextArticleId={nextArticleId}
        nextSentenceSeq={nextSentenceSeq}
        quickWriteItem={quickWriteItem}
      />
    </>
  );
};
