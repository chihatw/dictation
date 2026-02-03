import { HomeMVJ } from '@/components/home/mvj/HomeMVJ';
import { createClient } from '@/lib/supabase/server';

export const HomeMVJContainer = async ({ userId }: { userId: string }) => {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_mvj', { p_uid: userId });

  if (error) throw new Error((error as { message: string }).message);

  // rpc returns setof rows; take first
  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.mvj_id) return null;

  const mvjDueAtUtc = row.mvj_due_at ? new Date(row.mvj_due_at) : null;

  if (!mvjDueAtUtc) return null;

  return (
    <HomeMVJ
      mvjId={row.mvj_id}
      mvjImageUrl={row.mvj_image_url}
      mvjReason={row.mvj_reason}
      mvjDueAtUtc={mvjDueAtUtc}
      mvjTitle={row.mvj_title}
    />
  );
};
