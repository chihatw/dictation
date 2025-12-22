'use client';

import type { PlayerAPI } from '@/hooks/useAudioPlayer';
import { toPublicUrl } from '@/lib/tts/publicUrl';
import { Loader2, Play, Square } from 'lucide-react';

type Sentence = {
  id: string;
  seq: number;
  audio_path: string | null;
};

type Props = {
  sentences: Sentence[];
  player: PlayerAPI;

  // 追加：上位から制御
  currentUrl: string | null;
  onPlay: (url: string) => Promise<void>;
  onStop: () => void;
};

export function SentenceAudioList({
  sentences,
  player,
  currentUrl,
  onPlay,
  onStop,
}: Props) {
  return (
    <div className='grid gap-y-2'>
      {sentences.map((sentence) => {
        const audioUrl = sentence.audio_path
          ? toPublicUrl(sentence.audio_path)
          : null;

        const isCurrent = !!audioUrl && currentUrl === audioUrl;
        const showLoading = isCurrent && player.loading;
        const showStop = isCurrent && !player.loading && player.isPlaying;

        return (
          <div key={sentence.id} className='flex items-center gap-3'>
            <div className='w-10'>{sentence.seq}</div>

            {audioUrl ? (
              <button
                type='button'
                className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
                onClick={showStop ? onStop : () => onPlay(audioUrl)}
                disabled={showLoading}
                aria-busy={showLoading}
              >
                {showLoading ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    <span>Loading</span>
                  </>
                ) : showStop ? (
                  <>
                    <Square className='h-4 w-4' />
                    <span>停止</span>
                  </>
                ) : (
                  <>
                    <Play className='h-4 w-4' />
                    <span>再生</span>
                  </>
                )}
              </button>
            ) : (
              <div className='text-sm text-muted-foreground'>音声なし</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SentenceAudioRow({
  sentence,
  currentUrl,
  loading,
  isPlaying,
  onPlay,
  onStop,
}: {
  sentence: Sentence;
  currentUrl: string | null;
  loading: boolean;
  isPlaying: boolean;
  onPlay: (url: string) => Promise<void>;
  onStop: () => void;
}) {
  const audioUrl = sentence.audio_path
    ? toPublicUrl(sentence.audio_path)
    : null;

  const isCurrent = !!audioUrl && currentUrl === audioUrl;
  const showLoading = isCurrent && loading;
  const showStop = isCurrent && !loading && isPlaying;

  return (
    <div className='flex items-center gap-3'>
      <div className='w-10'>{sentence.seq}</div>

      {audioUrl ? (
        <button
          type='button'
          className='inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm'
          onClick={showStop ? onStop : () => onPlay(audioUrl)}
          disabled={showLoading}
          aria-busy={showLoading}
        >
          {showLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Loading</span>
            </>
          ) : showStop ? (
            <>
              <Square className='h-4 w-4' />
              <span>停止</span>
            </>
          ) : (
            <>
              <Play className='h-4 w-4' />
              <span>再生</span>
            </>
          )}
        </button>
      ) : (
        <div className='text-sm text-muted-foreground'>音声なし</div>
      )}
    </div>
  );
}
