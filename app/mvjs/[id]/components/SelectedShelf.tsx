'use client';
import { Image, Info, Loader2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
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

  // 画像選択 UI
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const pickFile = () => fileInputRef.current?.click();

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (!f.type.startsWith('image/')) return;
    const url = URL.createObjectURL(f);
    onPickImage(f, url);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFiles(e.target.files);
    e.currentTarget.value = '';
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };
  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragOver(false);
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

            <div
              className={[
                'w-full h-32 rounded-lg my-2 border-2 border-dashed flex justify-center items-center overflow-hidden relative',
                displaySrc
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-300 bg-slate-50',
                isDragOver
                  ? 'ring-2 ring-slate-400 ring-offset-1 ring-inset'
                  : '',
              ].join(' ')}
              onClick={() => !displaySrc && pickFile()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              role='button'
              aria-label={displaySrc ? '已選擇圖片' : '拖曳或點擊以選擇圖片'}
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type='file'
                accept='image/*'
                className='hidden'
                onChange={onInputChange}
              />

              {displaySrc ? (
                <>
                  <img
                    src={displaySrc}
                    alt='選擇的圖片預覽'
                    className='h-full w-full object-contain'
                  />
                  <button
                    type='button'
                    onClick={onClearImageUI}
                    className='absolute right-1.5 top-1.5 inline-flex items-center justify-center rounded-full bg-black/70 p-1 text-white hover:bg-black/80'
                    aria-label='刪除圖片'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </>
              ) : (
                <div className='flex gap-2 items-center text-slate-400 text-sm pointer-events-none'>
                  <Image className='h-4 w-4' />
                  <div>請將圖片拖曳到這裡 或點擊以選擇圖片</div>
                </div>
              )}
            </div>

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
