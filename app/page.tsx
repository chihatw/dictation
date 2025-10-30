// 動的レンダリング
export const dynamic = 'force-dynamic';

import TodayPanel from '@/components/home/TodayPanel';

import { createClient } from '@/lib/supabase/server';
import { formatDueTW, formatTodayTW } from '@/utils/home/formatDate';

import HomeCloze from '@/components/home/HomeCloze';
import { HomeJournals } from '@/components/home/HomeJornals';
import JournalQuickWriteButton from '@/components/home/JournalQuickWriteButton';
import { fetchMultiWeather } from '@/lib/openweathermap/fetchTaichungWeather';
import { dueDayStartUtc, timeProgress5pct } from '@/utils/timeProgress';
import Link from 'next/link';
import { journals, nextTask, weather } from './dummy';

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
        return [nextTask, journals, weather] as const;
      }
    : async () => {
        const [a, b, c] = await Promise.all([
          supabase.rpc('get_home_next_task', { p_uid: user.id }),
          supabase.rpc('pick_random_cloze_journal_fast', { p_uid: user.id }),
          fetchMultiWeather(),
        ]);
        return [a, b, c] as const;
      };

  const [
    { data, error },
    { data: journal, error: error_j },
    { yunlin, hyogo },
  ] = await fetchHomeBundle();

  if (error) throw new Error((error as { message: string }).message);
  if (error_j) throw new Error((error_j as { message: string }).message);
  if (!data) throw new Error('no data');

  const row = Array.isArray(data) ? data[0] : data;
  const startAt = row?.published_at as string | null | undefined;
  const dueAt = row?.due_at as string | null | undefined;
  const endAt = dueAt ? dueDayStartUtc(dueAt).toISOString() : null;
  const nextArticleId = row?.next_article_id as string | null | undefined;
  const dueStr = formatDueTW(dueAt);
  const todayStr = formatTodayTW();
  const pct = row?.total_count
    ? Math.round((row.done_count / row.total_count) * 100)
    : 0;
  const timeProgress = timeProgress5pct(startAt, endAt);
  const topAssignmentIds = row?.top_assignment_ids;
  const mvjId = row?.mvj_id;
  const mvjImageUrl = row?.mvj_image_url;
  const mvjReason = row?.mvj_reason;

  return (
    <div className='min-h-screen p-6'>
      <main className='mx-auto max-w-2xl space-y-6'>
        <TodayPanel todayStr={todayStr} yunlin={yunlin} hyogo={hyogo} />

        {/* 下次上課 */}
        <section className='rounded-xl border p-5 space-y-3 bg-white'>
          <div className='text-sm text-gray-500'>下次上課</div>
          <div className='text-xl'>{dueStr ?? '未設定'}</div>

          <div className='text-sm text-gray-700'>
            <div>
              時間進度為{` `}
              <span className='font-bold text-4xl'>{timeProgress}</span>%
            </div>
            <div className=' leading-none font-extralight text-gray-500'>
              <div>這表示從聽寫題目發布到上課當天凌晨 0 點為止的時間經過。</div>
              <div>請盡量規劃好進度，別在上課前一晚熬夜練習。</div>
            </div>
          </div>
        </section>

        {/* 下一個作業 */}
        <section className='rounded-xl border p-5 bg-white space-y-3'>
          <div className='text-sm text-gray-500'>作業</div>

          <div className='text-sm text-gray-700'>
            <div>
              作業進度為 <span className='font-bold text-4xl'>{pct}</span>%
            </div>
            <div className=' leading-none font-extralight text-gray-500'>
              語言學習重在習慣。 與其一天做很多，不如盡量每天都做一點。
            </div>
          </div>

          <JournalQuickWriteButton assignment_id={row.assignment_id} />

          {nextArticleId ? (
            <Link
              href={`/articles/${nextArticleId}`}
              className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors'
            >
              {`前往「${row.next_full_title ?? ''}」第 ${
                row.next_sentence_seq ?? ''
              } 行`}
            </Link>
          ) : (
            <div>
              <div className='text-sm  text-gray-700 mb-4'>
                所有作業都結束了，辛苦了！🎉
              </div>
              <Link
                href={`/assignments/${row.assignment_id}`}
                className='inline-flex items-center rounded-xl px-4 py-2 border text-gray-700 text-sm'
              >
                {`查看「${row.title ?? ''}」的成果`}
              </Link>
            </div>
          )}
        </section>

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

        <HomeJournals userId={user.id} topAssignmentIds={topAssignmentIds} />
      </main>
    </div>
  );
}
