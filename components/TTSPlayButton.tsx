'use client';

import { useTTS } from '@/hooks/useTTS';
import clsx from 'clsx';
import { Loader2, Play, Square } from 'lucide-react';

type Props = {
  text: string;
  voiceName: string;
  speakingRate: number;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'sm';
  className?: string;
  labels?: {
    idle?: string; // 再生待機中（ボタン表示）
    loading?: string; // 音声生成・準備中
    stop?: string; // 再生中 → 停止ボタン表示
    aria?: string; // aria-label
  };
};

export const TTSPlayButton = ({
  text,
  voiceName,
  speakingRate,
  variant = 'outline',
  size = 'sm',
  className,
  labels,
}: Props) => {
  const { play, stop, loading: ttsLoading, isPlaying } = useTTS();

  const handlePlayOrStop = async () => {
    if (!text || ttsLoading) return;
    if (isPlaying) {
      stop();
      return;
    }
    await play(text, { voiceName, speakingRate });
  };

  const base =
    'inline-flex items-center gap-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeCls = size === 'md' ? 'px-3 py-2 text-base' : 'px-3 py-1.5 text-sm';
  const variantCls =
    variant === 'solid'
      ? 'bg-gray-900 text-white hover:bg-gray-800'
      : 'border hover:bg-gray-50';

  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-4 h-4';

  const textIdle = labels?.idle ?? '再生';
  const textLoading = labels?.loading ?? '準備中';
  const textStop = labels?.stop ?? '停止';
  const aria = labels?.aria ?? '再生/停止';

  return (
    <button
      type='button'
      className={clsx(base, sizeCls, variantCls, className)}
      onClick={handlePlayOrStop}
      aria-label={aria}
      disabled={!text}
    >
      {ttsLoading ? (
        <>
          <Loader2 className={clsx(iconSize, 'animate-spin')} />
          <span>{textLoading}</span>
        </>
      ) : isPlaying ? (
        <>
          <Square className={iconSize} />
          <span>{textStop}</span>
        </>
      ) : (
        <>
          <Play className={iconSize} />
          <span>{textIdle}</span>
        </>
      )}
    </button>
  );
};
