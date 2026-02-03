// server component
import { HomePowerIndex } from '@/components/home/powerIndex/HomePowerIndex';
import { createClient } from '@/lib/supabase/server';
import type { PIState } from '@/types/dictation';

type PowerIndexRow = {
  power_index: number;
  power_index_state: PIState;
  consecutive_idle_days: number;
  current_streak_days: number;
  next_penalty: number;
  has_submissions: boolean;
  has_journal: boolean;
};

type DailyPoint = { day: string; score: number };

export async function HomePowerIndexContainer({ userId }: { userId: string }) {
  const supabase = await createClient();

  const [piRes, dailyRes] = await Promise.all([
    supabase.rpc('get_power_index', { p_uid: userId }),
    supabase
      .from('dictation_power_index_daily')
      .select('day, score')
      .eq('user_id', userId)
      .order('day', { ascending: false })
      .limit(30),
  ]);

  if (piRes.error)
    throw new Error((piRes.error as { message: string }).message);
  if (dailyRes.error)
    throw new Error((dailyRes.error as { message: string }).message);

  const row = (
    Array.isArray(piRes.data) ? piRes.data[0] : piRes.data
  ) as PowerIndexRow | null;

  if (!row) throw new Error('no power index data');

  const dailyPowerIndex = (dailyRes.data ?? []) as DailyPoint[];

  return (
    <HomePowerIndex
      piState={row.power_index_state}
      idleDays={row.consecutive_idle_days}
      powerIndex={row.power_index}
      nextPenalty={row.next_penalty}
      hasActivityToday={row.has_submissions || row.has_journal}
      dailyPowerIndex={dailyPowerIndex}
      currentStreakDays={row.current_streak_days}
    />
  );
}
