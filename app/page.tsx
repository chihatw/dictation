// 動的レンダリング
export const dynamic = 'force-dynamic';

import TodayPanel from '@/components/home/TodayPanel';

import { createClient } from '@/lib/supabase/server';
import { formatDueTW, formatTodayTW } from '@/utils/home/formatDate';
import { LinkIcon } from 'lucide-react';

import { fetchMultiWeather } from '@/lib/openweathermap/fetchTaichungWeather';
import { Journal } from '@/types/dictation';
import Link from 'next/link';
import { Vote } from './journals/Vote';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const [{ data, error }, { yunlin, hyogo }] = await Promise.all([
    supabase.rpc('get_home_next_task', { p_uid: user.id }),
    fetchMultiWeather(),
  ]);
  if (error) throw new Error(error.message);

  const row = Array.isArray(data) ? data[0] : data;
  const dueAt = row?.due_at as string | null | undefined;
  const nextArticleId = row?.next_article_id as string | null | undefined;
  const dueStr = formatDueTW(dueAt);
  const todayStr = formatTodayTW();
  const pct = row?.total_count
    ? Math.round((row.done_count / row.total_count) * 100)
    : 0;
  const timeProgress =
    typeof row?.time_progress_pct === 'number' ? row.time_progress_pct : 0;

  const journals: Journal[] = Array.isArray(row?.journals)
    ? (row!.journals as Journal[])
    : [];

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

          {nextArticleId ? (
            <Link
              href={`/articles/${nextArticleId}`}
              className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors'
            >
              {`前往「${row.collection_title ?? ''} ${row.subtitle ?? ''}」第 ${
                row.sentence_seq ?? ''
              } 行`}
            </Link>
          ) : (
            <div>
              <div className='text-sm  text-gray-700 mb-4'>
                所有作業都結束了，辛苦了！🎉
              </div>
              <Link
                href={`/collections/${row.collection_id}`}
                className='inline-flex items-center rounded-xl px-4 py-2 border text-gray-700 text-sm'
              >
                {`查看「${row.collection_title ?? ''}」的成果`}
              </Link>
            </div>
          )}
        </section>

        {/* 向過去的自己說聲謝謝 */}
        <section className='rounded-xl border p-5 bg-white space-y-4'>
          <h2 className='text-lg font-semibold'>向過去的自己說聲謝謝</h2>

          <div className='text-sm text-slate-700 space-y-0'>
            <p>
              <span className='font-extrabold'>過去的你</span>
              在忙碌之中把握每一點空檔學習，
              <span className='font-extrabold'>
                為了今天的你，留下這本學習日誌
              </span>
              。
            </p>
            <p>
              如果覺得這些記錄<span className='font-extrabold'>有幫助</span>，
              <span className='font-bold'>請按「👍Good」</span>
              向過去的自己<span className='font-extrabold'>說聲謝謝</span>。
            </p>
            <p>
              若你覺得<span className='font-extrabold'>「這在寫什麼？」</span>或
              <span className='font-extrabold'>「這樣的筆記完全幫不上忙」</span>
              ，<span className='font-extrabold'>請按「👎Bad」</span>
              提醒過去的自己<span className='font-extrabold'>需要改進</span>。
            </p>
            <p>
              <span className='font-extrabold'>
                給自己的感謝，或對自己的督促，都是讓你持續成長的力量
              </span>
              。
            </p>
            <p className='pt-2 text-xs font-extralight'>
              「👍 Good」和「👎 Bad」都可以按很多次，想按幾次都沒問題喔。
            </p>
          </div>

          <ul className='space-y-4'>
            {journals.map((j) => (
              <li key={j.id} className='rounded border p-3 bg-slate-50'>
                <Link href={`/articles/${j.article_id}`} className='block'>
                  <div className='flex items-center hover:underline gap-x-1'>
                    <time className='font-bold '>
                      {new Date(j.created_at).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        timeZone: 'Asia/Taipei',
                      })}
                    </time>
                    <time className='font-light text-slate-500 text-sm'>
                      {new Date(j.created_at).toLocaleString('ja-JP', {
                        hour: 'numeric',
                        minute: 'numeric',
                        timeZone: 'Asia/Taipei',
                      })}
                    </time>
                    <LinkIcon className='w-3 h-3 text-slate-500' />
                  </div>
                </Link>

                <div className='mt-1 text-sm text-gray-700'>
                  {j.body.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>

                <Vote
                  id={j.id}
                  initialScore={j.rating_score}
                  createdAt={j.created_at}
                />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
