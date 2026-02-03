import { createClient } from '@/lib/supabase/server';
import HomeCloze from './HomeCloze';

type Props = {
  userId: string;
};

export const dynamic = 'force-dynamic';

export async function HomeClozeContainer({ userId }: Props) {
  const supabase = await createClient();

  const { data: journal, error } = await supabase.rpc(
    'pick_random_cloze_journal_fast',
    { p_uid: userId },
  );

  if (error) throw new Error((error as { message: string }).message);

  // 1件もなければ何も出さない
  const j = journal?.[0];
  if (!j) return null;

  return <HomeCloze journal={j} />;
}
