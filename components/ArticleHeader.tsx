'use client';

import { toPublicUrl } from '@/lib/tts/publicUrl';
import { Article } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { UrlPlayButton } from './audio/UrlPlayButton';

type Props = {
  article: Article;
  isAdmin?: boolean;
};

export default function ArticleHeader({ article, isAdmin = false }: Props) {
  const audioUrl = article.audio_path_full
    ? toPublicUrl(article.audio_path_full)
    : undefined;
  return (
    <header className='sticky top-0 z-10 border-b bg-white/90 backdrop-blur'>
      <div className='mx-auto flex max-w-4xl items-center gap-3 px-4 py-3'>
        <div className='grid gap-2'>
          <Link
            href='/'
            className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
          >
            <ChevronLeft className='h-4 w-4' /> 返回首頁
          </Link>
          <Link
            href={`/collections/${article.collection_id}`}
            className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
          >
            <ChevronLeft className='h-4 w-4' /> 返回主題頁
          </Link>
        </div>
        <h1 className='ml-1 flex-1 truncate text-lg font-semibold'>
          {article.title}
        </h1>

        {isAdmin && (
          <Link
            href={`/admin/collections?user_id=${article.uid}`}
            className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
          >
            ユーザー別課題一覧
          </Link>
        )}
        {audioUrl && (
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
        )}
      </div>
    </header>
  );
}
