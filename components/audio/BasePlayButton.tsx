// components/TTS/BasePlayButton.tsx
'use client';

import clsx from 'clsx';
import { Loader2, Play, Square } from 'lucide-react';

type Labels = {
  idle?: string;
  loading?: string;
  stop?: string;
  aria?: string;
};

type BaseProps = {
  variant?: 'solid' | 'outline';
  size?: 'md' | 'sm';
  className?: string;
  labels?: Labels;
  loading: boolean;
  isPlaying: boolean;
  disabled?: boolean;
  onPlay: () => void | Promise<void>;
  onStop: () => void;
};

export const BasePlayButton = ({
  variant = 'outline',
  size = 'sm',
  className,
  labels,
  loading,
  isPlaying,
  disabled,
  onPlay,
  onStop,
}: BaseProps) => {
  const base =
    'inline-flex items-center gap-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeCls = size === 'md' ? 'px-3 py-2 text-base' : 'px-3 py-1.5 text-sm';
  const variantCls =
    variant === 'solid'
      ? 'bg-gray-900 text-white hover:bg-gray-800'
      : 'border hover:bg-gray-50';
  const iconSize = 'w-4 h-4';

  const textIdle = labels?.idle ?? '再生';
  const textLoading = labels?.loading ?? '準備中';
  const textStop = labels?.stop ?? '停止';
  const aria = labels?.aria ?? '再生/停止';

  const handleClick = async () => {
    if (loading) return;
    if (isPlaying) onStop();
    else await onPlay();
  };

  return (
    <button
      type='button'
      className={clsx(base, sizeCls, variantCls, className)}
      onClick={handleClick}
      aria-label={aria}
      disabled={disabled}
    >
      {loading ? (
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
