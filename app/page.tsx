// 動的レンダリング
export const dynamic = 'force-dynamic';

import TodayPanel from '@/components/home/TodayPanel';

import { createClient } from '@/lib/supabase/server';
import { formatDueTW, formatTodayTW } from '@/utils/home/formatDate';

import { HomeJournals } from '@/components/home/HomeJornals';
import JournalQuickWriteButton from '@/components/home/JournalQuickWriteButton';
import { fetchMultiWeather } from '@/lib/openweathermap/fetchTaichungWeather';
import { Journal } from '@/types/dictation';
import { dueDayStartUtc, timeProgress5pct } from '@/utils/timeProgress';
import Link from 'next/link';

const TEMP = {
  user_id: 'b2d7045a-bfb9-4aa2-88ed-fdfbac324e72',
  article_id: 'e81e64c6-6c20-4b18-a021-a84f729b0907',
  title: '臺灣的教師節禮物',
  subtitle: 'N5',
};

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const [{ data, error }, { yunlin, hyogo }, { data: temp }] =
    await Promise.all([
      supabase.rpc('get_home_next_task', { p_uid: user.id }),
      fetchMultiWeather(),
      supabase // 暫定処理
        .from('dictation_journals')
        .select('*')
        .eq('article_id', TEMP.article_id)
        .maybeSingle(),
    ]);
  if (error) throw new Error(error.message);

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

  const initialJournals = (row?.journals ?? []) as Journal[];
  const initialBefore = initialJournals.at(-1)?.created_at ?? null;
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

          {user.id === TEMP.user_id && !temp && (
            <div>
              <JournalQuickWriteButton
                articleId={TEMP.article_id}
                label={`寫「${TEMP.title} ${TEMP.subtitle}」的學習日誌`}
                enabled={user.id === TEMP.user_id && !temp}
              />
            </div>
          )}

          {nextArticleId ? (
            <Link
              href={`/articles/${nextArticleId}`}
              className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors'
            >
              {`前往「${row.title ?? ''} ${row.subtitle ?? ''}」第 ${
                row.sentence_seq ?? ''
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

        <HomeJournals
          initialBefore={initialBefore}
          initialItems={initialJournals}
          userId={user.id}
        />
      </main>
    </div>
  );
}
