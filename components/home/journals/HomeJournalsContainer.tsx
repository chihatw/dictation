// components/home/journals/HomeJournalsContainer.tsx
import { createClient } from '@/lib/supabase/server';
import { Journal } from '@/types/dictation';
import { HomeJournals } from './HomeJournals';

type JournalRowWithMeta = Journal & {
  next_before: string | null;
  has_more: boolean;
};

export async function HomeJournalsContainer({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_journals', { p_uid: userId });
  if (error) throw error;

  const rows = (data ?? []) as unknown as JournalRowWithMeta[];

  const initialBefore = rows[0]?.next_before ?? null;
  const initialHasMore = !!rows[0]?.has_more;

  const initialItems = rows.map(
    ({ next_before: _nb, has_more: _hm, ...j }) => j,
  );

  return (
    <HomeJournals
      userId={userId}
      initialItems={initialItems}
      initialBefore={initialBefore}
      initialHasMore={initialHasMore}
    />
  );
}
