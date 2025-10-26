'use client';

import { Journal } from '@/types/dictation';

const bestShadow = 'shadow-[inset_0_0_0_2px_theme(colors.yellow.500)]';
const silverShadow = 'shadow-[inset_0_0_0_2px_theme(colors.zinc.500)]';
const baseShadow = 'shadow-[inset_0_0_0_1px_theme(colors.black/0.05)]';

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(iso));

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleString('ja-JP', {
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Asia/Taipei',
  });

type Props = {
  journal: Pick<
    Journal,
    'id' | 'article_id' | 'body' | 'created_at' | 'rating_score'
  >;
  isBest: boolean;
  isHM: boolean;
  onToggleBest: (id: string) => void;
  onToggleHM: (id: string) => void;
};

export function JournalCard({
  journal: j,
  isBest,
  isHM,
  onToggleBest,
  onToggleHM,
}: Props) {
  return (
    <article
      className={[
        'rounded-xl border p-4 shadow-sm',
        isBest
          ? ['bg-amber-50', bestShadow].join(' ')
          : isHM
          ? ['bg-zinc-100', silverShadow].join(' ')
          : ['bg-white', baseShadow].join(' '),
      ].join(' ')}
    >
      <div className='mb-2 flex items-center justify-between'>
        <button
          aria-pressed={isBest}
          onClick={() => onToggleBest(j.id)}
          className={[
            'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs',
            isBest ? 'border-yellow-500' : 'border-gray-300',
          ].join(' ')}
          title='選為最佳作品'
        >
          ★ 最佳作品
        </button>
        <button
          aria-pressed={isHM}
          onClick={() => onToggleHM(j.id)}
          disabled={isBest}
          className={[
            'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs',
            isHM ? 'border-zinc-500' : 'border-gray-300',
            isBest ? 'opacity-40 cursor-not-allowed' : '',
          ].join(' ')}
          title='選為佳作'
        >
          ✓ 佳作
        </button>
      </div>

      <h3 className='mb-1 text-base font-semibold flex items-center gap-1'>
        <span>{fmtDate(j.created_at)}</span>
        <span className='font-light text-slate-500 text-sm'>
          {fmtTime(j.created_at)}
        </span>
      </h3>

      <div className='text-sm leading-6 text-gray-700 line-clamp-6 overflow-auto space-y-1.5'>
        {j.body.split('\n').map((line, idx) => (
          <div key={idx}>{line}</div>
        ))}
      </div>
    </article>
  );
}
