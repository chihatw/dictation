'use client';

import SentenceItem from '@/components/SentenceItem';
import { TTSPlayButton } from '@/components/TTSPlayButton';
import { supabase } from '@/lib/supabase/browser';
import { GOOGLE_VOICES } from '@/lib/tts/constants';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Props = {};

type Submission = {
  id: string;
  answer: string | null;
  feedback_md: string | null;
  created_at: string;
};

type Sentence = {
  id: string;
  seq: number;
  content: string;
  created_at: string;
  submission?: Submission[] | null;
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

  const [userId, setUserId] = useState<string | null>(null);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const [voiceName, setVoiceName] = useState<string>(
    GOOGLE_VOICES.premium['Chirp3-HD'].female['ja-JP-Chirp3-HD-Aoede']
  );
  const [speakingRate, setSpeakingRate] = useState<number>(1.0);

  const allSubmitted = useMemo(
    () => article?.sentences.every((s) => submitted[s.id]),
    [submitted, article?.sentences]
  );

  // 全文テキスト：余計な半角スペースを入れたくない場合は join('') が無難
  const fullText = useMemo(
    () => article?.sentences.map((s) => s.content).join('') ?? '',
    [article]
  );

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
        return;
      }
      setUserId(data.user?.id ?? null);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;
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
            id, title, created_at,
            sentences:dictation_sentences (
              id, seq, content, created_at,
              submission:dictation_submissions!left (
                id, answer, feedback_md, created_at
              )
            )
          `
        )
        .eq('id', id) // 対象記事
        .eq('sentences.dictation_submissions.user_id', userId)
        .order('seq', {
          referencedTable: 'dictation_sentences',
          ascending: true,
        })
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

        const nextAnswers: Record<string, string> = {};
        const nextSubmitted: Record<string, boolean> = {};
        const nextFeedbacks: Record<string, string> = {};

        for (const s of data.sentences ?? []) {
          const one = (s.submission ?? [])[0]; // 0 or 1
          nextAnswers[s.id] = one?.answer ?? '';
          nextSubmitted[s.id] = !!one;
          nextFeedbacks[s.id] = one?.feedback_md ?? '';
        }

        setAnswers(nextAnswers);
        setSubmitted(nextSubmitted);
        setFeedbacks(nextFeedbacks);
      }

      setLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [id, router, userId]);

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

  const submitOne = async (s: Sentence) => {
    const val = (answers[s.id] ?? '').trim();
    if (!val) return;

    if (!window.confirm('送出後不可再編輯')) return;

    // 楽観的UI：ロックしてから送る（失敗時は解除）
    setSubmitted((old) => ({ ...old, [s.id]: true }));
    setLoadingMap((old) => ({ ...old, [s.id]: true }));

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sentenceId: s.id, // 文のID
          sentenceScript: s.content, // 正解スクリプト
          userAnswer: val, // ユーザーの回答
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: { feedbackMarkdown: string } = await res.json();
      setFeedbacks((old) => ({ ...old, [s.id]: data.feedbackMarkdown }));
    } catch (e) {
      // 失敗時はロック解除（1回のみ送信厳守なら解除しない運用も可）
      setSubmitted((old) => ({ ...old, [s.id]: false }));
      alert('送信に失敗しました。ネットワーク等を確認してください。');
    } finally {
      setLoadingMap((old) => ({ ...old, [s.id]: false }));
    }
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
          {article.sentences.map((s) => (
            <SentenceItem
              key={s.id}
              sentence={s}
              value={answers[s.id] ?? ''}
              isSubmitted={submitted[s.id] ?? false}
              feedback={feedbacks[s.id]}
              voiceName={voiceName}
              speakingRate={speakingRate}
              onChange={(val) =>
                setAnswers((prev) => ({ ...prev, [s.id]: val }))
              }
              onSubmit={async () => submitOne(s)}
              submitting={loadingMap[s.id] ?? false}
            />
          ))}
        </div>

        <div className='mt-8 text-center text-sm text-gray-600'>
          {allSubmitted ? '所有句子都已送出。辛苦了！' : '未送出的回答'}
        </div>
      </main>
    </div>
  );
};

export default ArticlePage;
