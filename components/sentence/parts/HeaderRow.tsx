'use client';

import { ABPlayBar } from '@/components/audio/ABPlayBar';
import { GlobalPlayBar } from '@/components/audio/GlobalPlayBar';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { memo, useEffect, useState } from 'react';

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
  const player = useAudioPlayer();
  const [playOrigin, setPlayOrigin] = useState<'global' | 'ab' | null>(null);

  // 再生前にメタデータだけ取得（1回だけ）
  useEffect(() => {
    if (audioUrl) player.prime(audioUrl);
  }, [audioUrl, player]);

  // 再生が止まったら発火元をクリア
  useEffect(() => {
    if (!player.isPlaying) setPlayOrigin(null);
  }, [player.isPlaying]);

  return (
    <div className='flex w-full flex-col gap-2'>
      <div className='mb-1 flex items-center justify-between'>
        <h3 id={id} className='text-sm font-medium text-gray-600'>
          文 #{seq}
        </h3>
      </div>

      {audioUrl && (
        <>
          {/* 全體播放 */}
          <GlobalPlayBar
            audioUrl={audioUrl}
            disabled={disabled}
            onPlayStart={onPlay}
            player={player}
            playOrigin={playOrigin}
            onWillPlay={() => setPlayOrigin('global')}
            onDidStop={() => setPlayOrigin(null)}
          />

          {/* 區間播放 */}
          <ABPlayBar
            audioUrl={audioUrl}
            disabled={disabled}
            onPlayStart={onPlay}
            player={player}
            playOrigin={playOrigin}
            onWillPlay={() => setPlayOrigin('ab')}
            onDidStop={() => setPlayOrigin(null)}
          />
        </>
      )}
    </div>
  );
}

export const HeaderRow = memo(HeaderRowBase);
