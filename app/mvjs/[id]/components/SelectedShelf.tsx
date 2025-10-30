'use client';
import { Info, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { MVJBadges } from './MVJBadges';
import { MVJModal } from './MVJModal';

function Placeholder({ text }: { text: string }) {
  return (
    <div className='rounded-lg border border-dashed bg-gray-50 px-2 py-1 text-xs text-gray-500 shadow-[inset_0_0_0_1px_var(--color-gray-200)] whitespace-nowrap'>
      {text}
    </div>
  );
}

type Props = {
  bestId: string | null;
  hmIds: string[];
  initialBestId: string | null;
  initialHmIds: string[];
  labelsById: Record<string, string>;
  onClearBest: () => void;
  onToggleHM: (id: string) => void;
  onSubmit: () => void;
  reason: string;
  onReasonChange: (v: string) => void;
  dueAt: Date;
  isPending: boolean;
  serverReason: string;
};

export function SelectedShelf({
  bestId,
  hmIds,
  initialBestId,
  initialHmIds,
  labelsById,
  reason,
  onReasonChange,
  onClearBest,
  onToggleHM,
  onSubmit,
  dueAt,
  isPending,
  serverReason,
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

  // canSubmit 管理
  const [isBeforeDue, setIsBeforeDue] = useState(
    () => Date.now() <= dueAt.getTime()
  );

  useEffect(() => {
    // 初回即時チェック
    setIsBeforeDue(Date.now() <= dueAt.getTime());

    const id = setInterval(() => {
      setIsBeforeDue(Date.now() <= dueAt.getTime());
    }, 60_000);

    return () => clearInterval(id);
  }, [dueAt]);

  const sameSet = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const s = new Set(a);
    for (const x of b) if (!s.has(x)) return false;
    return true;
  };

  const awardsChanged = useMemo(() => {
    const bestChanged = (bestId ?? null) !== (initialBestId ?? null);
    const hmChanged = !sameSet(hmIds, initialHmIds);
    return bestChanged || hmChanged;
  }, [bestId, hmIds, initialBestId, initialHmIds]);

  const canSubmit = useMemo(() => {
    const hasText = reason.trim().length > 0;
    const reasonChanged = reason.trim() !== (serverReason ?? '').trim();
    return (
      hasText && isBeforeDue && !isPending && (reasonChanged || awardsChanged)
    );
  }, [reason, serverReason, isBeforeDue, isPending, awardsChanged]);

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
            <MVJBadges
              bestId={bestId}
              hmIds={hmIds}
              labelsById={labelsById}
              onClearBest={onClearBest}
              onToggleHM={onToggleHM}
            />
            <div className='h-48'>
              <div className='rounded-lg bg-slate-50'>Image</div>
            </div>
            <div className='mt-3 space-y-1.5'>
              <textarea
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                className='w-full rounded-lg border bg-white px-3 py-2 text-sm leading-6 focus:outline-0'
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
              className='shrink-0 rounded-lg bg-black px-3 py-2 text-white hover:cursor-pointer disabled:opacity-50 disabled:hover:cursor-not-allowed flex justify-center'
              onClick={onSubmit}
              disabled={!canSubmit}
              aria-disabled={!canSubmit}
            >
              {isPending ? <Loader2 className='animate-spin' /> : `確認送出`}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
