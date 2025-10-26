'use client';
import { useState } from 'react';

type Journal = {
  id: string;
  created_at: string; // ISO
  article_id: string;
  body: string;
  rating_score: number;
};

// 色ユーティリティ
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

export function JournalPicker({ items }: { items: Journal[] }) {
  const [bestId, setBestId] = useState<string | null>(null);
  const [hmIds, setHmIds] = useState<string[]>([]);

  const toggleBest = (id: string) =>
    setBestId((prev) => {
      const next = prev === id ? null : id;
      setHmIds((h) => h.filter((x) => x !== id));
      return next;
    });

  const toggleHM = (id: string) =>
    setHmIds((prev) => {
      const included = prev.includes(id);
      if (!included && bestId === id) setBestId(null);
      return included ? prev.filter((x) => x !== id) : [...prev, id];
    });

  return (
    <main className='mx-auto max-w-6xl px-4 py-6'>
      {/* 選出棚 */}
      <section className='sticky top-0 z-10 mb-4 rounded-xl border bg-white/90 p-3 backdrop-blur'>
        <div className='flex items-center gap-3'>
          <div className='flex-1 overflow-hidden'>
            <div
              className='flex gap-2 overflow-x-auto items-center min-h-9 pr-1'
              aria-live='polite'
            >
              {bestId ? (
                <Badge
                  id={bestId}
                  label='最優秀'
                  color='gold'
                  onClear={() => setBestId(null)}
                />
              ) : (
                <Placeholder text='最優秀作は選出されていません' />
              )}
              {hmIds.length ? (
                hmIds.map((id) => (
                  <Badge
                    key={id}
                    id={id}
                    label='佳作'
                    color='silver'
                    onClear={() => toggleHM(id)}
                  />
                ))
              ) : (
                <Placeholder text='佳作は選出されていません' />
              )}
            </div>
          </div>
          <button
            className='shrink-0 rounded-lg bg-black px-3 py-2 text-white'
            onClick={() => {
              // submit(bestId, hmIds)
            }}
          >
            選出を確定
          </button>
        </div>
      </section>

      {/* 一覧：固定 */}
      <section
        className='
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-4
        '
      >
        {items.map((j) => {
          const isBest = bestId === j.id;
          const isHM = hmIds.includes(j.id);
          return (
            <article
              key={j.id}
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
                  onClick={() => toggleBest(j.id)}
                  className={[
                    'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs',
                    isBest ? 'border-yellow-500' : 'border-gray-300',
                  ].join(' ')}
                  title='最優秀に選ぶ'
                >
                  ★ 最優秀
                </button>
                <button
                  aria-pressed={isHM}
                  onClick={() => toggleHM(j.id)}
                  disabled={isBest}
                  className={[
                    'inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs',
                    isHM ? 'border-zinc-500' : 'border-gray-300', // 修正: 存在するトークン
                    isBest ? 'opacity-40 cursor-not-allowed' : '',
                  ].join(' ')}
                  title='佳作に選ぶ'
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
        })}
      </section>
    </main>
  );
}

function Placeholder({ text }: { text: string }) {
  return (
    <div
      className='
        rounded-lg border border-dashed bg-gray-50 px-2 py-1 text-xs text-gray-500
        shadow-[inset_0_0_0_1px_var(--color-gray-200)]
        whitespace-nowrap
      '
    >
      {text}
    </div>
  );
}

function Badge({
  id,
  label,
  color,
  onClear,
}: {
  id: string;
  label: string;
  color: 'gold' | 'silver';
  onClear: () => void;
}) {
  const colorShadow =
    color === 'gold'
      ? 'shadow-[inset_0_0_0_2px_theme(colors.amber.500)]'
      : 'shadow-[inset_0_0_0_2px_theme(colors.zinc.500)]';
  const bgTint = color === 'gold' ? 'bg-amber-50' : 'bg-zinc-100';

  return (
    <div
      className={[
        'flex items-center gap-2 rounded-lg border px-2 py-1 text-xs whitespace-nowrap',
        bgTint,
        colorShadow,
      ].join(' ')}
    >
      <span>{label}</span>
      <span className='text-gray-600'>#{id}</span>
      <button
        onClick={onClear}
        aria-label={`${label}から外す`}
        className='ml-1'
      >
        ×
      </button>
    </div>
  );
}
