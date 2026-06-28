// app/actions.ts (Server Action)
'use server';

import { requireUserAction } from '@/lib/auth/guards';
import { JournalPage } from '@/types/dictation';
import { notFound } from 'next/navigation';

type JournalRowWithMeta = {
  id: string;
  created_at: string; // timestamptz
  article_id: string;
  body: string;
  rating_score: number;
  cloze_spans: unknown; // jsonb。必要なら型を当てる
  locked: boolean;
  self_award: string;
  next_before: string | null; // timestamptz
  has_more: boolean;
};

export async function fetchMoreJournals(userId: string, before: string) {
  const { supabase, user } = await requireUserAction();

  if (userId !== user.id) {
    notFound();
  }

  const { data, error } = await supabase.rpc('get_journals_more', {
    p_uid: userId,
    p_before: before,
    p_limit: 10,
  });

  if (error) throw error;

  const rows = (data ?? []) as JournalRowWithMeta[];

  const next_before = rows[0]?.next_before ?? null;
  const has_more = rows[0]?.has_more ?? false;

  const items = rows.map(
    ({ next_before: _nb, has_more: _hm, ...item }) => item,
  );

  return { items, next_before, has_more } as JournalPage;
}
