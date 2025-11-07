// 動的レンダリング
export const dynamic = 'force-dynamic';

import TodayPanel from '@/components/home/TodayPanel';

import { createClient } from '@/lib/supabase/server';

import HomeCloze from '@/components/home/HomeCloze';
import { HomeJournals } from '@/components/home/HomeJornals';
import { HomePowerIndex } from '@/components/home/HomePowerIndex';
import { NextClass } from '@/components/home/NextClass';
import { NextTask } from '@/components/home/NextTask';
import { fetchMultiWeather } from '@/lib/openweathermap/fetchTaichungWeather';
import Link from 'next/link';
import { DAILY_POWER_INDEX, JOURNALS, NEXT_TASK, WEATHER } from './dummy';

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'true';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const fetchHomeBundle = DEBUG
    ? async () => {
        console.log('no fetch');
        return [NEXT_TASK, JOURNALS, DAILY_POWER_INDEX, WEATHER] as const;
      }
    : async () => {
        const [nextTask, journals, dailyPowerIndex, weather] =
          await Promise.all([
            supabase.rpc('get_home_next_task', { p_uid: user.id }),
            supabase.rpc('pick_random_cloze_journal_fast', { p_uid: user.id }),
            supabase
              .from('dictation_power_index_daily')
              .select('day, score')
              .order('day', { ascending: false })
              .eq('user_id', user.id)
              .limit(7),
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
  const mvjImageUrl = row?.mvj_image_url;
  const mvjReason = row?.mvj_reason;

  return (
    <div className='min-h-screen p-6'>
      <main className='mx-auto max-w-2xl space-y-6'>
        <TodayPanel yunlin={yunlin} hyogo={hyogo} />

        <NextClass dueAt={row?.due_at} startAt={row?.published_at} />

        <NextTask
          totalCount={row?.total_count}
          doneCount={row?.done_count ?? 0}
          title={row?.title}
          assignmentId={row?.assignment_id}
          nextFullTitle={row?.next_full_title}
          nextArticleId={row?.next_article_id}
          nextSentenceSeq={row?.next_sentence_seq}
        />

        <HomePowerIndex
          piState={row?.power_index_state}
          idleDays={row?.consecutive_idle_days}
          powerIndex={row?.power_index}
          nextPenalty={row?.next_penalty}
          hasSubmissions={row?.has_submissions}
          dailyPowerIndex={dailyPowerIndex || []}
        />

        {mvjId && (
          <section className='rounded-xl border p-5 bg-amber-50 space-y-3 flex flex-col shadow-xl'>
            <div className='grid gap-1'>
              <Link
                href={`/mvjs/${mvjId}`}
                className='text-center hover:underline'
              >
                <span className='font-bold text-2xl text-slate-900 text-shadow-2xs'>
                  🏆 選出9-10月最有價值日誌 🏆
                </span>
              </Link>
              <div className='text-xs text-center text-slate-500'>
                截止日期: 11/12（三） 凌晨0:00。
              </div>
            </div>
            {mvjImageUrl && (
              <div className='flex justify-center'>
                <img
                  src={mvjImageUrl}
                  alt='最佳作品圖片'
                  className='rounded shadow-md max-h-64 object-contain'
                />
              </div>
            )}
            {mvjReason && (
              <div className='grid text-center text-sm text-slate-700'>
                {mvjReason}
              </div>
            )}
          </section>
        )}

        {journal && journal[0] && <HomeCloze journal={journal[0]} />}

        <HomeJournals
          userId={user.id}
          topAssignmentIds={row?.top_assignment_ids}
        />
      </main>
    </div>
  );
}
