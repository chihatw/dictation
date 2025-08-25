'use client';

import { TTSPlayButton } from '@/components/TTSPlayButton';
import { useTTS } from '@/hooks/useTTS';
import { supabase } from '@/lib/supabase/browser';
import { GOOGLE_VOICES } from '@/lib/tts/constants';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Props = {};

type Sentence = {
  id: string;
  seq: number;
  content: string;
  created_at: string;
};

type Article = {
  id: string;
  title: string;
  created_at: string;
  sentences: Sentence[];
};

const ArticlePage = ({}: Props) => {
  const { id } = useParams<{ id: string }>();

  const router = useRouter();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const [voiceName, setVoiceName] = useState<string>(
    GOOGLE_VOICES.premium['Chirp3-HD'].female['ja-JP-Chirp3-HD-Aoede']
  );
  const [speakingRate, setSpeakingRate] = useState<number>(1.0);

  // 全文テキスト：余計な半角スペースを入れたくない場合は join('') が無難
  const fullText = useMemo(
    () => article?.sentences.map((s) => s.content).join('') ?? '',
    [article]
  );

  const {
    play,
    stop,
    loading: ttsLoading,
    error: ttsError,
    isPlaying,
  } = useTTS();

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setErrMsg(null);

      // 記事 + 子テーブル(sentences)を一括取得（リレーション指定）
      //    外部テーブルの order は foreignTable を指定
      const { data, error } = await supabase
        .from('dictation_articles')
        .select(
          `
            id,
            title,
            created_at,
            sentences:dictation_sentences (
              id,
              seq,
              content,
              created_at
            )
          `
        )
        .eq('id', id) // 対象記事
        .order('seq', { foreignTable: 'dictation_sentences', ascending: true })
        .maybeSingle(); // 0 or 1 件を期待

      if (!mounted) return;

      if (error) {
        console.error(error);
        setErrMsg('記事の取得に失敗しました。');
      } else if (!data) {
        setErrMsg('記事が見つかりませんでした。');
      } else {
        setArticle({
          id: data.id,
          title: data.title,
          created_at: data.created_at,
          sentences: data.sentences ?? [],
        });
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id, router]);

  if (loading) {
    return (
      <div className='p-6 max-w-2xl mx-auto'>
        <div className='animate-pulse space-y-4'>
          <div className='h-6 w-1/2 bg-gray-200 rounded' />
          <div className='h-4 w-3/4 bg-gray-200 rounded' />
          <div className='h-4 w-2/3 bg-gray-200 rounded' />
        </div>
      </div>
    );
  }

  if (errMsg) {
    return (
      <div className='p-6 max-w-2xl mx-auto'>
        <p className='text-red-600'>{errMsg}</p>
      </div>
    );
  }

  if (!article) return null;

  const handlePlayOrStop = async (text: string) => {
    if (!text || ttsLoading) return;

    if (isPlaying) {
      stop();
      return;
    }

    await play(text, {
      voiceName,
      speakingRate,
    });
  };

  return (
    <div className='min-h-screen'>
      {/* ヘッダー（最小：戻る + タイトル + 全体再生/停止） */}
      <header className='sticky top-0 z-10 border-b bg-white/90 backdrop-blur'>
        <div className='mx-auto flex max-w-4xl items-center gap-3 px-4 py-3'>
          <Link
            href='/'
            className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
          >
            <ChevronLeft className='h-4 w-4' /> 戻る
          </Link>
          <h1 className='ml-1 flex-1 truncate text-lg font-semibold'>
            {article?.title}
          </h1>
          <TTSPlayButton
            text={fullText}
            voiceName={voiceName}
            speakingRate={speakingRate}
            variant='solid'
            size='md'
            labels={{
              idle: '全体再生',
              loading: '読み上げ準備中',
              stop: '停止',
              aria: '全体を再生/停止',
            }}
          />
        </div>
      </header>

      <main className='mx-auto max-w-4xl px-4 py-6'>
        <div className='space-y-5'>
          {article.sentences.length === 0 ? (
            <p className='text-gray-500'>まだ文がありません。</p>
          ) : (
            <>
              {article.sentences.map((s) => {
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
                        文 #{s.seq}
                      </div>
                      <div className='flex items-center gap-2'>
                        <TTSPlayButton
                          text={s.content}
                          voiceName={voiceName}
                          speakingRate={speakingRate}
                          variant='outline'
                          size='sm'
                          labels={{
                            idle: '再生',
                            loading: '準備中',
                            stop: '停止',
                          }}
                        />
                      </div>
                    </div>
                  </section>
                );
              })}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
