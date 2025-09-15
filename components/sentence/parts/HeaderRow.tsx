'use client';

import { UrlPlayButton } from '@/components/audio/UrlPlayButton';
import { memo } from 'react';

export type HeaderRowProps = {
  id: string;
  seq: number;
  audioUrl?: string;
  disabled?: boolean;
  onPlay?: () => void;
};

function HeaderRowBase({
  id,
  seq,
  audioUrl,
  disabled,
  onPlay,
}: HeaderRowProps) {
  return (
    <div className='mb-3 flex items-center justify-between'>
      <h3 id={id} className='text-sm font-medium text-gray-600'>
        文 #{seq}
      </h3>
      <div className='flex items-center gap-2'>
        {audioUrl && (
          <UrlPlayButton
            audioUrl={audioUrl}
            variant='solid'
            size='md'
            labels={{ idle: '播放', loading: '載入中', stop: '停止' }}
            className={disabled ? 'pointer-events-none opacity-50' : undefined}
            onPlayStart={onPlay}
          />
        )}
      </div>
    </div>
  );
}

export const HeaderRow = memo(HeaderRowBase);
