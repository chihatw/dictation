'use client';

import { toPublicUrl } from '@/lib/tts/publicUrl';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { TTSPlayButton } from './audio/TTSPlayButton';
import { UrlPlayButton } from './audio/UrlPlayButton';

type Props = {
  title: string;
  text: string;
  voiceName: string;
  speakingRate: number;
  audioPathFull?: string | null;
};

export default function ArticleHeader({
  title,
  text,
  voiceName,
  speakingRate,
  audioPathFull,
}: Props) {
  const audioUrl = audioPathFull ? toPublicUrl(audioPathFull) : undefined;
  return (
    <header className='sticky top-0 z-10 border-b bg-white/90 backdrop-blur'>
      <div className='mx-auto flex max-w-4xl items-center gap-3 px-4 py-3'>
        <Link
          href='/'
          className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
        >
          <ChevronLeft className='h-4 w-4' /> 返回首頁
        </Link>
        <h1 className='ml-1 flex-1 truncate text-lg font-semibold'>{title}</h1>
        {audioUrl ? (
          <UrlPlayButton
            audioUrl={audioUrl}
            variant='solid'
            size='md'
            labels={{
              idle: '全部播放',
              loading: '朗讀準備中...',
              stop: '停止',
              aria: '全体を再生/停止',
            }}
          />
        ) : (
          <TTSPlayButton
            text={text}
            voiceName={voiceName}
            speakingRate={speakingRate}
            variant='solid'
            size='md'
            labels={{
              idle: '全部播放',
              loading: '朗讀準備中...',
              stop: '停止',
              aria: '全体を再生/停止',
            }}
          />
        )}
      </div>
    </header>
  );
}
