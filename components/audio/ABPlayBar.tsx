// components/audio/ABPlayBar.tsx
'use client';

import { Slider } from '@/components/ui/slider';
import { PlayerAPI } from '@/hooks/useAudioPlayer';
import { formatTime } from '@/utils/formatTime';
import clsx from 'clsx';
import { Play, Square } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type Props = {
  audioUrl: string;
  className?: string;
  disabled?: boolean;
  onPlayStart?: () => void;
  player: PlayerAPI;
  playOrigin: 'global' | 'ab' | null;
  onWillPlay?: () => void;
  onDidStop?: () => void;
};

export const ABPlayBar = ({
  audioUrl,
  className,
  disabled,
  onPlayStart,
  player,
  playOrigin,
  onWillPlay,
  onDidStop,
}: Props) => {
  const { playUrl, pause, seek, isPlaying, duration, currentTime, loading } =
    player;
  const active = playOrigin === 'ab' && isPlaying; // ← 自分が発火元のときだけ「停止」

  const [range, setRange] = useState<[number, number]>([0, 0]); // [A,B]
  const [dragging, setDragging] = useState(false);

  const canUse = !!audioUrl && duration > 0;
  const [aPos, bPos] = range;
  const effectiveB = useMemo(
    () => (Number.isFinite(bPos) && bPos > 0 ? bPos : duration),
    [bPos, duration]
  );

  // 初期化：メタデータ取得後に [0, duration]
  useEffect(() => {
    if (canUse) setRange(([, b]) => [0, b && b > 0 ? b : duration]);
  }, [canUse, duration]);

  // B到達時の効果を発火元でガード
  useEffect(() => {
    if (playOrigin !== 'ab') return; // ← 追加
    if (!isPlaying || !canUse || dragging) return;
    if (currentTime >= effectiveB) {
      pause();
      seek(aPos);
      onDidStop?.();
    }
  }, [
    playOrigin,
    isPlaying,
    canUse,
    dragging,
    currentTime,
    effectiveB,
    aPos,
    pause,
    seek,
    onDidStop,
  ]);

  const handlePlay = async () => {
    if (!canUse || loading || disabled) return;
    onPlayStart?.();
    onWillPlay?.(); // ← 追加：発火元=ab
    await playUrl(audioUrl);
    seek(aPos);
  };

  const handleStop = () => {
    pause();
    seek(aPos); // 停止後は常に開始へ戻す
    onDidStop?.();
  };

  const onValueChange = (vals: number[]) => {
    if (!canUse) return;
    if (!dragging) {
      setDragging(true);
      pause(); // ドラッグ開始で停止
    }
    // A<=B を保証
    const a = Math.max(0, Math.min(vals[0] ?? 0, duration));
    const b = Math.max(a, Math.min(vals[1] ?? duration, duration));
    setRange([a, b]);
  };

  const onValueCommit = (vals: number[]) => {
    // ドロップ後は停止のまま。確定だけ。
    const a = Math.max(0, Math.min(vals[0] ?? 0, duration));
    const b = Math.max(a, Math.min(vals[1] ?? duration, duration));
    setRange([a, b]);
    setDragging(false);
  };

  return (
    <div className={clsx('flex w-full items-center gap-3', className)}>
      {/* A 時刻 */}
      <span className='w-12 text-right tabular-nums whitespace-nowrap'>
        {formatTime(aPos)}
      </span>

      {/* 単一スライダー（2ハンドル） */}
      <Slider
        min={0}
        max={duration || 0}
        step={0.01}
        value={[aPos, effectiveB]}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        disabled={!canUse || disabled}
        className='w-full'
      />

      {/* B 時刻 */}
      <span className='w-12 tabular-nums whitespace-nowrap'>
        {formatTime(effectiveB)}
      </span>

      {/* 再生/停止 */}
      <button
        type='button'
        onClick={active ? handleStop : handlePlay}
        disabled={!audioUrl || disabled}
        aria-label='區間播放 播放/停止'
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm bg-gray-900 hover:bg-gray-800 text-white',
          'w-36 whitespace-nowrap',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {active ? <Square className='h-4 w-4' /> : <Play className='h-4 w-4' />}
        <span>{active ? '停止' : '區間播放'}</span>
      </button>
    </div>
  );
};
