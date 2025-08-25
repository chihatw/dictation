'use client';

import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TTSPlayButton } from './TTSPlayButton';

type Sentence = {
  id: string;
  seq: number;
  content: string; // 正解スクリプト(音声と一致)
};

type Props = {
  sentence: Sentence;
  value: string;
  isSubmitted: boolean;
  feedback?: string | null;
  voiceName: string;
  speakingRate: number;
  onChange: (val: string) => void;
  onSubmit: () => Promise<void>; // 親がAPI呼び出しを実装
  submitting?: boolean;
};

export default function SentenceItem({
  sentence,
  value,
  isSubmitted,
  feedback,
  voiceName,
  speakingRate,
  onChange,
  onSubmit,
  submitting,
}: Props) {
  return (
    <section className='rounded-xl border bg-white p-4 shadow-sm'>
      {/* 文番号 + 再生（最小） */}
      <div className='mb-3 flex items-center justify-between'>
        <div className='text-sm font-medium text-gray-600'>
          文 #{sentence.seq}
        </div>
        <div className='flex items-center gap-2'>
          <TTSPlayButton
            text={sentence.content}
            voiceName={voiceName}
            speakingRate={speakingRate}
            variant='outline'
            size='sm'
            labels={{ idle: '再生', loading: '準備中', stop: '停止' }}
          />
        </div>
      </div>

      {/* 回答欄（送信後はロック） */}
      <div>
        {isSubmitted ? (
          <div className='rounded-md border bg-gray-50 p-3'>
            <div className='mb-1 text-xs font-semibold text-gray-500'>
              你的回答（已送出）
            </div>
            <p className='whitespace-pre-wrap text-gray-800'>{value}</p>
          </div>
        ) : (
          <textarea
            className='w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-gray-900'
            rows={3}
            placeholder='輸入你聽到的日文'
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>

      {/* 送信（各文1回のみ） */}
      <div className='mt-3 flex justify-end'>
        <button
          disabled={isSubmitted || !value.trim() || submitting}
          onClick={() => onSubmit()}
          className='inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <Send className='h-4 w-4' />
          {submitting ? '送出中…' : '送出'}
        </button>
      </div>

      {/* AI 返答（Markdown 整形表示だけ） */}
      {isSubmitted && feedback && (
        <div className='mt-4 rounded-md border p-3'>
          <div className='mb-2 text-sm font-semibold text-gray-700'>AI回饋</div>
          <div className='prose prose-sm max-w-none'>
            <ReactMarkdown>{feedback}</ReactMarkdown>
          </div>

          {/* 正解スクリプト */}
          <div className='mt-4 rounded-md bg-gray-50 p-3'>
            <div className='mb-1 text-xs font-semibold text-gray-500'>
              音聲原文
            </div>
            <p className='whitespace-pre-wrap text-gray-800'>
              {sentence.content}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
