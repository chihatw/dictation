'use client';

import { Vote } from '@/components/journal/Vote';
import { ClozeSpan, Journal } from '@/types/dictation';

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
  journal: Journal;
  isBest: boolean;
  isHM: boolean;
  onToggleBest: (id: string) => void;
  onToggleHM: (id: string) => void;
  onScoreOptimistic: (score: number) => void;
  onScoreSettled: (score: number) => void;
};

export function JournalCard({
  journal: j,
  isBest,
  isHM,
  onToggleBest,
  onToggleHM,
  onScoreOptimistic,
  onScoreSettled,
}: Props) {
  return (
    <article
      className={[
        'rounded-xl border p-4 shadow-sm flex flex-col',
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
      <div>
        <h3 className='mb-1 text-base font-semibold flex items-center gap-1'>
          <span>{fmtDate(j.created_at)}</span>
          <span className='font-light text-slate-500 text-sm'>
            {fmtTime(j.created_at)}
          </span>
        </h3>
      </div>
      <EmphasizedBody body={j.body} spans={j.cloze_spans} />
      <div className='mt-2'>
        <Vote
          journal={j}
          onOptimistic={(next) => onScoreOptimistic(next)}
          onSettled={(serverScore) => onScoreSettled(serverScore)}
        />
      </div>
    </article>
  );
}

function normalizeSpans(spans: ClozeSpan[], len: number): ClozeSpan[] {
  const s = spans
    .map(([start, l]) => [Math.max(0, start), Math.max(0, l)] as ClozeSpan)
    .map(
      ([start, l]) =>
        [start, Math.min(l, Math.max(0, len - start))] as ClozeSpan
    )
    .filter(([, l]) => l > 0)
    .sort((a, b) => a[0] - b[0]);

  const merged: ClozeSpan[] = [];
  for (const [start, l] of s) {
    if (!merged.length) {
      merged.push([start, l]);
      continue;
    }
    const [ps, pl] = merged[merged.length - 1];
    const pend = ps + pl;
    if (start <= pend) {
      merged[merged.length - 1] = [ps, Math.max(pl, start + l - ps)];
    } else {
      merged.push([start, l]);
    }
  }
  return merged;
}

function EmphasizedBody({ body, spans }: { body: string; spans: ClozeSpan[] }) {
  const norm = normalizeSpans(spans ?? [], body.length);
  const parts: React.ReactNode[] = [];
  let i = 0;

  norm.forEach(([start, l], idx) => {
    if (start > i)
      parts.push(
        <span key={`t-${idx}`} className='font-extralight'>
          {body.slice(i, start)}
        </span>
      );
    parts.push(
      <strong key={`b-${idx}`} className='font-extrabold'>
        {body.slice(start, start + l)}
      </strong>
    );
    i = start + l;
  });
  if (i < body.length)
    parts.push(
      <span key='t-end' className='font-extralight'>
        {body.slice(i)}
      </span>
    );

  return (
    <div className='text-sm leading-6 text-gray-700 whitespace-pre-wrap flex-1'>
      {parts}
    </div>
  );
}
