'use client';

import { PIState } from '@/types/dictation';
import { CircleQuestionMark } from 'lucide-react';
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const formatDayLabel = (day: string) => {
  // "2025-10-28" -> "10/28"
  return day.slice(5).replace('-', '/');
};

const getYDomain = (points: { score: number }[]) => {
  if (points.length === 0) return [0, 1];

  const scores = points.map((p) => p.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);

  if (min === max) {
    // 全部同じ値のときは見やすいように少し幅を持たせる
    return [min - 10, max + 10];
  }

  const padding = Math.max(5, Math.round((max - min) * 0.1));
  return [min - padding, max + padding];
};

export const HomePowerIndex = ({
  hasSubmissions,
  idleDays,
  nextPenalty,
  powerIndex,
  dailyPowerIndex,
  piState,
}: {
  hasSubmissions: boolean;
  idleDays: number;
  nextPenalty: number;
  powerIndex: number;
  dailyPowerIndex: { day: string; score: number }[];
  piState: PIState;
}) => {
  const todayInTaipei = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
  }).format(new Date());
  const sorted = [
    ...dailyPowerIndex,
    { day: todayInTaipei, score: powerIndex },
  ].sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());

  const yDomain = getYDomain(sorted);

  return (
    <section className='rounded-xl border p-5 bg-white space-y-3'>
      <div className='flex items-start justify-between'>
        <div className='text-sm text-gray-500'>指標</div>
        <button
          type='button'
          aria-label='寫學習日誌可獲得加分，若一天未練習則會扣分。未練習的天數連續越多，扣分幅度也會越大。'
          className='relative inline-flex text-slate-400 transition-colors focus:outline-none focus-visible:text-slate-600 group'
        >
          <CircleQuestionMark className='h-4 w-4 group-hover:text-slate-600' />
          <span className='pointer-events-none absolute right-0 top-full z-10 mt-2 w-60 rounded-md bg-slate-900 px-3 py-2 text-xs font-light leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
            寫學習日誌可獲得加分，若一天未練習則會扣分。未練習的天數連續越多，扣分幅度也會越大。
          </span>
        </button>
      </div>
      <div>
        <div className='text-sm text-gray-700'>
          日語資產指數
          <span className='pl-2 font-bold text-4xl'>{powerIndex}</span>
        </div>
        {piState === 'running' ? (
          <PowerIndexMessage
            nextPenalty={nextPenalty}
            idleDays={idleDays}
            hasSubmissions={hasSubmissions}
          />
        ) : (
          <div className='text-sm text-gray-500 pt-2'>🛑 待命中</div>
        )}
      </div>
      <div className='h-32 rounded-lg bg-slate-100'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={sorted}
            margin={{ top: 10, right: 30, left: 30, bottom: 0 }}
          >
            {/* 横軸: 日付 MM/DD  */}
            <XAxis
              dataKey='day'
              tickFormatter={formatDayLabel}
              tick={{ fontSize: 10 }}
            />

            {/* 縦軸: スケールだけ使う。UI は非表示 */}
            <YAxis hide domain={yDomain} />

            {/* ホバーで日付と score を表示 */}
            <Tooltip
              formatter={(value: number) => [value, '指數']}
              labelFormatter={(l) => ''}
            />

            {/* 曲線グラフ: monotone でカーブ */}
            <Line
              type='monotone'
              dataKey='score'
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 4 }}
              stroke='#334155'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

const PowerIndexMessage = ({
  hasSubmissions,
  idleDays,
  nextPenalty,
}: {
  hasSubmissions: boolean;
  idleDays: number;
  nextPenalty: number;
}) => {
  return (
    <div className='text-sm text-gray-500 font-extralight leading-none'>
      {hasSubmissions ? (
        <div className='pb-2'>
          今天有練習呢！請保持這個節奏，每天都持續一點點就很好。
        </div>
      ) : idleDays ? (
        <div>
          <span>目前已經</span>
          <span className='font-bold text-gray-700 text-base px-1'>
            {idleDays + 1}
          </span>
          <span className='pr-1'>天 沒有練習了。若再不練習，將會扣</span>
          <span className='font-bold text-gray-700 text-base px-1'>
            {nextPenalty}
          </span>
          <span> 分。</span>
        </div>
      ) : (
        <div>
          <span>今天還沒練習喔。若持續未練習，將會扣</span>
          <span className='font-bold text-gray-700 text-base px-1'>
            {nextPenalty}
          </span>
          <span>分。</span>
        </div>
      )}
    </div>
  );
};
