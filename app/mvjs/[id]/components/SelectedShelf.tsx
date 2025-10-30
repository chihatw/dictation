'use client';
import { Info, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ImageDropBox from './ImageDropBox';
import { MVJBadges } from './MVJBadges';
import { MVJModal } from './MVJModal';

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
  serverReason: string;

  // 保存済みの公開URL（UI表示用）
  imageUrl: string;
  // 新規選択ファイルのプレビュー制御
  previewUrl: string;
  onPickImage: (file: File, previewUrl: string) => void;
  // UI から完全に消す（プレビューと imageUrl を空に）
  onClearImageUI: () => void;

  dueAt: Date;
  isPending: boolean;
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
  imageUrl,
  previewUrl,
  onPickImage,
  onClearImageUI,
}: Props) {
  const placeholder = bestId
    ? '說明這篇「最佳作品」在什麼場景、對誰可以使用'
    : '請先選擇一篇「最佳作品」。';

  // 導入モーダル
  const [introOpen, setIntroOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  useEffect(() => {
    const flag = localStorage.getItem('hideIntroModal');
    if (!flag) setIntroOpen(true);
  }, []);
  const closeIntro = () => {
    setIntroOpen(false);
    if (dontShowAgain) localStorage.setItem('hideIntroModal', 'true');
  };

  // 期限
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

  // 送信可否
  const canSubmit = useMemo(() => {
    const hasBest = !!bestId;
    const hasNewImage = !!previewUrl;
    const hasSavedImage = !!imageUrl;
    const hasAnyImage = hasNewImage || hasSavedImage;
    const reasonChanged = reason.trim() !== (serverReason ?? '').trim();
    const imageChanged = !!previewUrl;
    return (
      hasBest &&
      hasAnyImage &&
      reason.trim().length > 0 &&
      isBeforeDue &&
      !isPending &&
      (reasonChanged || awardsChanged || imageChanged)
    );
  }, [
    bestId,
    reason,
    serverReason,
    previewUrl,
    imageUrl,
    isBeforeDue,
    isPending,
    awardsChanged,
  ]);

  // 表示ソースはプレビュー優先
  const displaySrc = previewUrl || imageUrl;

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

            <ImageDropBox
              displaySrc={displaySrc}
              onPickImage={onPickImage}
              onClear={onClearImageUI}
              emptyAriaLabel={
                displaySrc ? '已選擇圖片' : '拖曳或點擊以選擇圖片'
              }
              disabled={isPending}
            />

            <div className='mt-3 space-y-1.5'>
              <input
                type='text'
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                className='w-full rounded-lg border bg-white px-3 py-2 text-sm leading-6 focus:outline-0'
                placeholder={placeholder}
                aria-describedby='reason-help reason-count'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 shrink-0'>
            <button
              className='px-2 py-1 text-slate-900 text-xs tracking-tighter cursor-pointer flex items-center gap-0.5 hover:underline'
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
              {isPending ? <Loader2 className='animate-spin' /> : '確認送出'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
