'use client';

import { useTTS } from '@/hooks/useTTS';
import { supabase } from '@/lib/supabase/browser';
import { GOOGLE_VOICES } from '@/lib/tts/constants';
import { Home, Loader2, Play, Square } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const [playState, setPlayState] = useState<'idle' | 'loading' | 'playing'>(
    'idle'
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

  // 全文テキスト：余計な半角スペースを入れたくない場合は join('') が無難
  const fullText = article.sentences.map((s) => s.content).join('');

  const handlePlayOrStop = async () => {
    if (article.sentences.length === 0 || ttsLoading) return;

    if (isPlaying) {
      stop();
      return;
    }

    // 任意: 音声オプションを渡したい場合
    // 例) const options = { voiceName: 'ja-JP-Standard-A', speakingRate: 1.0 };
    await play(fullText, {
      voiceName:
        GOOGLE_VOICES.premium['Chirp3-HD'].female['ja-JP-Chirp3-HD-Aoede'],
    });
  };

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-6 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <header className='flex items-center gap-x-4'>
          <Link
            href='/'
            className='p-2 rounded-full hover:bg-gray-100 transition'
            title='ホームへ戻る'
          >
            <Home className='w-5 h-5 text-gray-600' />
          </Link>
          <h1 className='text-2xl font-semibold'>{article?.title}</h1>

          {/* ホームへ戻るボタン */}
        </header>
        <section className='flex flex-col items-center justify-center my-4'>
          <button
            type='button'
            onClick={handlePlayOrStop}
            disabled={article.sentences.length === 0 || ttsLoading}
            aria-label={
              ttsLoading ? '読み上げ準備中' : isPlaying ? '停止' : '全文を再生'
            }
            title={
              ttsLoading
                ? '読み上げの準備中…'
                : isPlaying
                ? '停止'
                : '全文を再生'
            }
            className={[
              'w-24 h-24 md:w-28 md:h-28 rounded-full border',
              'flex items-center justify-center',
              'shadow-sm hover:shadow transition',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'bg-white',
            ].join(' ')}
          >
            {ttsLoading && <Loader2 className='w-10 h-10 animate-spin' />}
            {!ttsLoading && !isPlaying && <Play className='w-10 h-10' />}
            {!ttsLoading && isPlaying && <Square className='w-10 h-10' />}
          </button>

          {/* 任意: エラー表示 */}
          {ttsError && <p className='mt-2 text-sm text-red-600'>{ttsError}</p>}
        </section>
        <section>
          {article.sentences.length === 0 ? (
            <p className='text-gray-500'>まだ文がありません。</p>
          ) : (
            <ol className='space-y-2 list-decimal pl-6'>
              {article.sentences.map((s) => (
                <li key={s.id} className='rounded border p-3'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-1'>
                      <p className='whitespace-pre-wrap'>{s.content}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
};

export default ArticlePage;
