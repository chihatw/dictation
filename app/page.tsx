// 動的レンダリング
export const dynamic = 'force-dynamic';

import TodayPanel from '@/components/home/TodayPanel';
import { fetchTaichungWeather } from '@/lib/openweathermap/fetchTaichungWeather';
import { createClient } from '@/lib/supabase/server';
import { formatDueTW, formatTodayTW } from '@/utils/home/formatDate';
import { remainDaysHours } from '@/utils/home/remainDaysHours';

import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const [{ data, error }, wx] = await Promise.all([
    supabase.rpc('get_home_next_task', { p_uid: user.id }),
    fetchTaichungWeather(),
  ]);
  if (error) throw new Error(error.message);

  const row = Array.isArray(data) ? data[0] : data;
  const dueAt = row?.due_at as string | null | undefined;
  const nextArticleId = row?.next_article_id as string | null | undefined;
  const dueStr = formatDueTW(dueAt);
  const remain = remainDaysHours(dueAt);
  const todayStr = formatTodayTW();
  const pct = row?.total_count
    ? Math.round((row.done_count / row.total_count) * 100)
    : 0;

  return (
    <div className='min-h-screen p-6'>
      <main className='mx-auto max-w-2xl space-y-6'>
        <TodayPanel todayStr={todayStr} wx={wx} />

        <section className='rounded-xl border p-5 space-y-3 bg-white'>
          <div className='text-sm text-gray-500'>下次上課</div>
          <div className='text-xl'>{dueStr ?? '未設定'}</div>
          <div className='text-sm text-gray-600'>
            剩餘時間：
            {remain ? (
              <span>
                {remain.days}天 {remain.hours}小時
              </span>
            ) : (
              <span>—</span>
            )}
          </div>
        </section>

        <section className='rounded-xl border p-5 bg-white space-y-3'>
          <div className='text-sm text-gray-500'>下一個作業</div>

          {/* 進捗メッセージ */}
          <div className='text-sm text-gray-700'>
            <div>
              目前進度為 <span className='font-semibold text-xl'>{pct}</span>%
            </div>
            <div>語言學習重在習慣。 與其一天做很多，不如盡量每天都做一點。</div>
          </div>

          {nextArticleId ? (
            <Link
              href={`/articles/${nextArticleId}`}
              className='inline-flex items-center rounded-xl px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors'
            >
              {`前往「${row.collection_title ?? ''} ${row.subtitle ?? ''}」第 ${
                row.sentence_seq ?? ''
              } 行`}
            </Link>
          ) : (
            <button
              disabled
              className='inline-flex items-center rounded-xl px-4 py-2 bg-slate-900 text-white opacity-50 cursor-not-allowed'
            >
              無待辦作業
            </button>
          )}
        </section>
      </main>
    </div>
  );
}
