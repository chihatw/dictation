// 動的レンダリング
export const dynamic = 'force-dynamic';

import TodayPanel from '@/components/home/TodayPanel';

import { createClient } from '@/lib/supabase/server';

import HomeCloze from '@/components/home/HomeCloze';
import { HomeJournals } from '@/components/home/HomeJornals';
import { HomeMVJ } from '@/components/home/HomeMVJ';
import { NextClass } from '@/components/home/NextClass';
import { NextTask } from '@/components/home/NextTask';
import { HomePowerIndex } from '@/components/home/powerIndex/HomePowerIndex';
import { fetchMultiWeather } from '@/lib/openweathermap/fetchTaichungWeather';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const fetchHomeBundle = async () => {
    const [nextTask, journals, dailyPowerIndex, weather] = await Promise.all([
      supabase.rpc('get_home_next_task', { p_uid: user.id }),
      supabase.rpc('pick_random_cloze_journal_fast', { p_uid: user.id }),
      supabase
        .from('dictation_power_index_daily')
        .select('day, score')
        .eq('user_id', user.id)
        .order('day', { ascending: false })
        .limit(30),
      fetchMultiWeather(),
    ]);
    return [nextTask, journals, dailyPowerIndex, weather] as const;
  };

  const [
    { data, error },
    { data: journal, error: error_j },
    { data: dailyPowerIndex, error: error_d },
    { yunlin, hyogo },
  ] = await fetchHomeBundle();

  if (error) throw new Error((error as { message: string }).message);
  if (error_j) throw new Error((error_j as { message: string }).message);
  if (error_d) throw new Error((error_d as { message: string }).message);
  if (!data) throw new Error('no data');

  const row = Array.isArray(data) ? data[0] : data;
  const mvjId = row?.mvj_id;
  const mvjTitle = row?.mvj_title;
  const mvjImageUrl = row?.mvj_image_url;
  const mvjReason = row?.mvj_reason;
  const mvjDueAtUtc = new Date(row?.mvj_due_at);

  const { data: quickWriteItems, error: qErr } = await supabase
    .from('dictation_article_journal_status_view')
    .select('article_id, full_title')
    .eq('assignment_id', row?.assignment_id)
    .eq('all_done', true)
    .eq('has_journal', false)
    .order('seq');

  if (qErr) throw new Error(qErr.message);

  return (
    <div className='min-h-screen p-6'>
      <main className='mx-auto max-w-2xl space-y-6'>
        <TodayPanel yunlin={yunlin} hyogo={hyogo} />

        <NextClass dueAt={row?.due_at} startAt={row?.published_at} />

        <NextTask
          totalCount={row?.total_count}
          doneCount={row?.done_count ?? 0}
          assignmentId={row?.assignment_id}
          nextFullTitle={row?.next_full_title}
          nextArticleId={row?.next_article_id}
          nextSentenceSeq={row?.next_sentence_seq}
          quickWriteItems={(quickWriteItems ?? []).map((i) => ({
            article_id: i.article_id as string,
            full_title: i.full_title as string,
          }))}
        />

        <HomeMVJ
          mvjId={mvjId}
          mvjImageUrl={mvjImageUrl}
          mvjReason={mvjReason}
          mvjDueAtUtc={mvjDueAtUtc}
          mvjTitle={mvjTitle}
        />

        <HomePowerIndex
          piState={row?.power_index_state}
          idleDays={row?.consecutive_idle_days}
          powerIndex={row?.power_index}
          nextPenalty={row?.next_penalty}
          hasSubmissions={row?.has_submissions}
          dailyPowerIndex={dailyPowerIndex || []}
          currentStreakDays={row?.current_streak_days}
        />

        {journal && journal[0] && <HomeCloze journal={journal[0]} />}

        <HomeJournals
          userId={user.id}
          topAssignmentIds={row?.top_assignment_ids}
        />
      </main>
    </div>
  );
}
