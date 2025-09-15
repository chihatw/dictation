'use client';

import { PlayerAPI } from '@/hooks/useAudioPlayer';
import { formatTime } from '@/utils/formatTime';
import clsx from 'clsx';
import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { Slider } from '../ui/slider';

type Props = {
  audioUrl: string;
  className?: string;
  disabled?: boolean;
  onPlayStart?: () => void; // 既存の停止連携に利用可
  player: PlayerAPI;
  playOrigin: 'global' | 'ab' | null;
  onWillPlay?: () => void;
  onDidStop?: () => void;
};

export const GlobalPlayBar = ({
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
  const active = playOrigin === 'global' && isPlaying; // ← 自分が発火元のときだけ「暫停」
  const [dragging, setDragging] = useState(false);
  const [dragValue, setDragValue] = useState(0); // 秒

  const canUse = !!audioUrl && duration > 0;

  const handleToggle = async () => {
    if (loading || disabled) return;
    if (active) {
      // 自分がアクティブの時だけ止める
      pause();
      onDidStop?.();
      return;
    }
    onPlayStart?.();
    onWillPlay?.(); // ← 追加：発火元=global
    await playUrl(audioUrl); // 位置は維持される
  };

  const sliderVal = dragging ? dragValue : currentTime;

  // Slider: ドラッグ開始で停止、確定で seek。自動再開なし
  const onValueChange = (vals: number[]) => {
    if (!canUse) return;
    if (!dragging) {
      setDragging(true);
      setDragValue(currentTime); // 現位置から開始
      pause();
    }
    setDragValue(Math.max(0, Math.min(vals[0] ?? 0, duration)));
  };
  const onValueCommit = (vals: number[]) => {
    if (!canUse) return;
    const v = Math.max(0, Math.min(vals[0] ?? 0, duration));
    seek(v);
    setDragging(false);
  };

  return (
    <div className={clsx('flex w-full items-center gap-3', className)}>
      <span className='w-12 text-right tabular-nums whitespace-nowrap'>
        {formatTime(sliderVal)}
      </span>

      <Slider
        min={0}
        max={duration || 0}
        step={0.01}
        value={[sliderVal]}
        onValueChange={onValueChange}
        onValueCommit={onValueCommit}
        disabled={!canUse || disabled}
        className='w-full'
      />

      <span className='w-12 tabular-nums whitespace-nowrap'>
        {formatTime(duration)}
      </span>
      <button
        type='button'
        onClick={handleToggle}
        disabled={!audioUrl || disabled}
        aria-label='整段播放 播放/暫停'
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-md border px-3 py-1.5 text-sm bg-gray-900 hover:bg-gray-800 text-white',
          'w-36 whitespace-nowrap', // ← 追加: 幅固定 + 改行禁止
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {active ? <Pause className='h-4 w-4' /> : <Play className='h-4 w-4' />}
        <span>{active ? '暫停' : '整段播放'}</span> {/* ← 中国語 */}
      </button>
    </div>
  );
};
