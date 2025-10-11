// app/actions.ts (Server Action)
'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { JournalPage } from '@/types/dictation';

export async function fetchMoreJournals(userId: string, before: string) {
  const supabase = await createClientAction();
  const { data, error } = await supabase.rpc('get_home_more_journals', {
    p_uid: userId,
    p_before: before,
    p_limit: 10,
  });
  if (error) throw error;
  return data as JournalPage;
}
