'use client';

import { ChevronLeft, Pause, Play, Send } from 'lucide-react';
import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type Props = {};

type Sentence = {
  id: string;
  index: number; // 1-based
  audioUrl: string; // mock / 実環境では音源 URL
  aiFeedback?: string; // AI の Markdown を"表示だけ"する
};

function getArticleData() {
  // id を使って DB から記事と文リストを取得する想定
  // ここでは固定のモックを返す
  const title = `聽力練習：Lesson 01`;
  const sentences: Sentence[] = [
    {
      id: 's1',
      index: 1,
      audioUrl: '/audio/s1.mp3',
      aiFeedback: '**Great try!** You missed the article in `the cat`',
    },
    {
      id: 's2',
      index: 2,
      audioUrl: '/audio/s2.mp3',
      aiFeedback: '**Nice!** `walked` の綴りを見直そう。',
    },
    {
      id: 's3',
      index: 3,
      audioUrl: '/audio/s3.mp3',
      aiFeedback: '**Good effort.** 前置詞の使い分けに注意。',
    },
  ];
  return { title, sentences };
}

const MockPage = (props: Props) => {
  const data = getArticleData();
  return (
    <div className='min-h-screen bg-gray-50'>
      <DictationArticleClient title={data.title} sentences={data.sentences} />
    </div>
  );
};

export default MockPage;

function DictationArticleClient({
  title,
  sentences,
}: {
  title: string;
  sentences: Sentence[];
}) {
  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const allSubmitted = useMemo(
    () => sentences.every((s) => submitted[s.id]),
    [submitted, sentences]
  );

  return (
    <div className='min-h-screen'>
      {/* ヘッダー（最小：戻る + タイトル + 全体再生/停止） */}
      <header className='sticky top-0 z-10 border-b bg-white/90 backdrop-blur'>
        <div className='mx-auto flex max-w-4xl items-center gap-3 px-4 py-3'>
          <button
            className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
            onClick={() => history.back()}
          >
            <ChevronLeft className='h-4 w-4' /> 戻る
          </button>
          <h1 className='ml-1 flex-1 truncate text-lg font-semibold'>
            {title}
          </h1>

          <button
            className='inline-flex items-center gap-2 rounded-md bg-gray-900 px-3 py-2 text-white hover:bg-gray-800'
            onClick={() => setIsGlobalPlaying((v) => !v)}
            aria-label='全体を再生/停止'
          >
            {isGlobalPlaying ? (
              <>
                <Pause className='h-4 w-4' /> 停止
              </>
            ) : (
              <>
                <Play className='h-4 w-4' /> 全体再生
              </>
            )}
          </button>
        </div>
      </header>

      {/* 本文 */}
      <main className='mx-auto max-w-4xl px-4 py-6'>
        <div className='space-y-5'>
          {sentences.map((s) => {
            const value = answers[s.id] ?? '';
            const isSubmitted = submitted[s.id] ?? false;

            return (
              <section
                key={s.id}
                className='rounded-xl border bg-white p-4 shadow-sm'
              >
                {/* 文番号 + 再生（最小） */}
                <div className='mb-3 flex items-center justify-between'>
                  <div className='text-sm font-medium text-gray-600'>
                    文 #{s.index}
                  </div>
                  <div className='flex items-center gap-2'>
                    <button
                      className='inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50'
                      onClick={() =>
                        alert(`文${s.index}の音声を再生（モック）`)
                      }
                    >
                      <Play className='h-4 w-4' /> 再生
                    </button>
                  </div>
                </div>

                {/* 回答欄（送信後はロック） */}
                <div>
                  {isSubmitted ? (
                    <div className='rounded-md border bg-gray-50 p-3'>
                      <div className='mb-1 text-xs font-semibold text-gray-500'>
                        あなたの回答（ロック済）
                      </div>
                      <p className='whitespace-pre-wrap text-gray-800'>
                        {value}
                      </p>
                    </div>
                  ) : (
                    <textarea
                      className='w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-gray-900'
                      rows={3}
                      placeholder='聞こえた英文を入力'
                      value={value}
                      onChange={(e) =>
                        setAnswers((old) => ({
                          ...old,
                          [s.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                </div>

                {/* 送信（各文1回のみ） */}
                <div className='mt-3 flex justify-end'>
                  <button
                    disabled={isSubmitted || !value.trim()}
                    onClick={() => {
                      if (
                        !window.confirm(
                          'この文を送信します。送信後は編集できません。'
                        )
                      )
                        return;
                      setSubmitted((old) => ({ ...old, [s.id]: true }));
                      // 実環境：ここでAI採点の呼び出し。UIは Markdown 表示のみ。
                    }}
                    className='inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    <Send className='h-4 w-4' /> 送信
                  </button>
                </div>

                {/* AI 返答（Markdown 整形表示だけ） */}
                {isSubmitted && s.aiFeedback && (
                  <div className='mt-4 rounded-md border p-3'>
                    <div className='mb-2 text-sm font-semibold text-gray-700'>
                      AI からのフィードバック
                    </div>
                    <div className='prose prose-sm max-w-none'>
                      <ReactMarkdown>{s.aiFeedback}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className='mt-8 text-center text-sm text-gray-600'>
          {allSubmitted
            ? 'すべての文を送信しました。おつかれさま！'
            : '未送信の文があります。'}
        </div>
      </main>
    </div>
  );
}
