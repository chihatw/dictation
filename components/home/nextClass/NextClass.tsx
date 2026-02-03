import { formatDueTW } from '@/utils/home/formatDate';
import { dueDayStartUtc, timeProgress5pct } from '@/utils/timeProgress';
import { CircleQuestionMark } from 'lucide-react';

export const NextClass = ({
  dueAt,

  startAt,
}: {
  startAt: string | null | undefined;
  dueAt: string | null | undefined;
}) => {
  const endAt = dueAt ? dueDayStartUtc(dueAt).toISOString() : null;
  const timeProgress = timeProgress5pct(startAt, endAt);
  const dueStr = formatDueTW(dueAt);
  return (
    <section className='rounded-xl border p-5 space-y-3 bg-white'>
      <div className='flex items-start justify-between'>
        <div className='text-sm text-gray-500'>下次上課</div>
        <button
          type='button'
          aria-label='這表示從聽寫題目發布到上課當天凌晨 0點為止的時間經過。請盡量規劃好進度，別在上課前一晚熬夜練習。'
          className='relative inline-flex text-slate-400 transition-colors focus:outline-none focus-visible:text-slate-600 group'
        >
          <CircleQuestionMark className='h-4 w-4 group-hover:text-slate-600' />
          <span className='pointer-events-none absolute right-0 top-full z-10 mt-2 w-60 rounded-md bg-slate-900 px-3 py-2 text-xs font-light leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
            這表示從聽寫題目發布到上課當天凌晨
            0點為止的時間經過。請盡量規劃好進度，別在上課前一晚熬夜練習。
          </span>
        </button>
      </div>
      <div className='text-xl'>{dueStr ?? '未設定'}</div>

      <div className='text-sm text-gray-700'>
        <div>
          時間進度
          <span className='pl-2 font-bold text-4xl'>{timeProgress}</span>%
        </div>
      </div>
    </section>
  );
};
