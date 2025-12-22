'use client';

import type { PlayerAPI } from '@/hooks/useAudioPlayer';
import { Loader2, Play, Square } from 'lucide-react';
import { useState } from 'react';
import { SentenceAudioList } from './SentenceAudioList';

type Sentence = {
  id: string;
  seq: number;
  audio_path: string | null;
};

type Props = {
  audioFullUrl?: string;
  sentences: Sentence[];
  player: PlayerAPI;
};

export function SentenceAudioPanel({ audioFullUrl, sentences, player }: Props) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);

  const startFromBeginning = async (url: string) => {
    player.pause();
    player.seek(0);

    setCurrentUrl(url);
    await player.playUrl(url);
  };

  const stop = () => {
    player.pause();
    player.seek(0);
    setCurrentUrl(null);
  };

  const isFullCurrent = !!audioFullUrl && currentUrl === audioFullUrl;
  const fullLoading = isFullCurrent && player.loading;
  const fullStop = isFullCurrent && !player.loading && player.isPlaying;

  return (
    <div className='space-y-4'>
      {/* 全文ボタン */}
      {audioFullUrl ? (
        <button
          type='button'
          className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
          onClick={fullStop ? stop : () => startFromBeginning(audioFullUrl)}
          disabled={fullLoading}
          aria-busy={fullLoading}
        >
          {fullLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Loading</span>
            </>
          ) : fullStop ? (
            <>
              <Square className='h-4 w-4' />
              <span>停止（全文）</span>
            </>
          ) : (
            <>
              <Play className='h-4 w-4' />
              <span>再生（全文）</span>
            </>
          )}
        </button>
      ) : (
        <div className='text-sm text-muted-foreground'>全文音声なし</div>
      )}

      {/* 文ごとのリスト（同じ currentUrl/stop/start を共有） */}
      <SentenceAudioList
        sentences={sentences}
        player={player}
        currentUrl={currentUrl}
        onPlay={startFromBeginning}
        onStop={stop}
      />
    </div>
  );
}
