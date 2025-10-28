'use client';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from './Badge';
import { MVJModal } from './MVJModal';

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

type Props = {
  bestId: string | null;
  hmIds: string[];
  labelsById: Record<string, string>;
  onClearBest: () => void;
  onToggleHM: (id: string) => void;
  onSubmit: () => void;
  reason: string;
  onReasonChange: (v: string) => void;
};

export function SelectedShelf({
  bestId,
  hmIds,
  labelsById,
  reason,
  onReasonChange,
  onClearBest,
  onToggleHM,
  onSubmit,
}: Props) {
  const placeholder = bestId
    ? '為什麼選這篇為「最佳作品」？'
    : '為什麼本月未選出「最佳作品」？';

  // 導入文モーダル
  const [introOpen, setIntroOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // 初回判定
  useEffect(() => {
    const flag = localStorage.getItem('hideIntroModal');
    if (!flag) setIntroOpen(true);
  }, []);

  const closeIntro = () => {
    setIntroOpen(false);
    if (dontShowAgain) localStorage.setItem('hideIntroModal', 'true');
  };

  return (
    <>
      {introOpen && (
        <MVJModal
          dontShowAgain={dontShowAgain}
          closeIntro={closeIntro}
          setDontShowAgain={setDontShowAgain}
        />
      )}

      <section className='sticky top-0 z-10 mb-4 rounded-xl border bg-white/90 p-3 backdrop-blur'>
        <div className='flex gap-3 '>
          <div className='flex-1 overflow-hidden'>
            <div>
              <div
                className='flex flex-wrap gap-2 items-center min-h-9'
                aria-live='polite'
              >
                {bestId ? (
                  <Badge
                    id={bestId}
                    label={labelsById[bestId] ?? '最佳作品'}
                    color='gold'
                    onClear={onClearBest}
                  />
                ) : (
                  <Placeholder text='尚未選出最佳作品' />
                )}
                {hmIds.length ? (
                  hmIds.map((id) => (
                    <Badge
                      key={id}
                      id={id}
                      label={labelsById[id] ?? '佳作'}
                      color='silver'
                      onClear={() => onToggleHM(id)}
                    />
                  ))
                ) : (
                  <Placeholder text='尚未選出佳作' />
                )}
              </div>
            </div>
            <div className='mt-3 space-y-1.5'>
              <textarea
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                className='w-full rounded-lg border bg-white px-3 py-2 text-sm leading-6 outline-none focus:ring-2 focus:ring-black/10'
                placeholder={placeholder}
                aria-describedby='reason-help reason-count'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 pb-1.5 shrink-0'>
            <button
              className=' px-2 py-1 text-slate-900 text-xs tracking-tighter cursor-pointer flex items-center gap-0.5 hover:underline'
              onClick={() => setIntroOpen(true)}
            >
              <div>關於這項活動</div>
              <Info className='w-3.5 h-3.5' />
            </button>
            <div className='flex-1' />
            <button
              className='shrink-0 rounded-lg bg-black px-3 py-2 text-white'
              onClick={onSubmit}
            >
              確認送出
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
