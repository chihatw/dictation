'use client';

import { TTSPlayButton } from '@/components/TTSPlayButton';
import { memo } from 'react';

export type HeaderRowProps = {
  id: string;
  seq: number;
  tts: { text: string; voiceName: string; speakingRate: number };
  audioUrl?: string;
  disabled?: boolean;
};

function HeaderRowBase({ id, seq, tts, audioUrl, disabled }: HeaderRowProps) {
  return (
    <div className='mb-3 flex items-center justify-between'>
      <h3 id={id} className='text-sm font-medium text-gray-600'>
        文 #{seq}
      </h3>
      <div className='flex items-center gap-2'>
        <TTSPlayButton
          audioUrl={audioUrl}
          text={tts.text}
          voiceName={tts.voiceName}
          speakingRate={tts.speakingRate}
          variant='outline'
          size='sm'
          labels={{ idle: '播放', loading: '載入中', stop: '停止' }}
          className={disabled ? 'pointer-events-none opacity-50' : undefined}
        />
      </div>
    </div>
  );
}

export const HeaderRow = memo(HeaderRowBase);
