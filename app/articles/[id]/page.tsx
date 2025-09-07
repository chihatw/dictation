'use client';

import ArticleHeader from '@/components/ArticleHeader';
import SentencesList from '@/components/SentencesList';
import { useArticle } from '@/hooks/useArticle';
import { supabase } from '@/lib/supabase/browser';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  // 記事の TTS 初期値
  const [voiceName, setVoiceName] = useState('ja-JP-Chirp3-HD-Aoede');
  const [speakingRate, setSpeakingRate] = useState(1.0);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const role = data.user?.app_metadata?.role;
      setIsAdmin(role === 'admin');
    });
  }, []);

  const {
    article,
    loading,
    errMsg,
    fullText,
    allSubmitted,
    answers,
    setAnswers,
    submitted,
    feedbacks,
    loadingMap,
    submitOne,
  } = useArticle(id);

  // 記事読込後に TTS 設定を記事値へ上書き
  useEffect(() => {
    if (!article) return;
    if (article.tts_voice_name) setVoiceName(article.tts_voice_name);
    if (typeof article.speaking_rate === 'number')
      setSpeakingRate(article.speaking_rate);
  }, [article, article?.id]); // 記事が切り替わった時のみ

  const handleSubmitOne = (sentenceId: string) => {
    const s = article?.sentences.find((x) => x.id === sentenceId);
    if (!s) return;
    submitOne(s);
  };

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

  return (
    <div className='min-h-screen'>
      <ArticleHeader
        title={article.title}
        text={fullText}
        voiceName={voiceName}
        speakingRate={speakingRate}
        audioPathFull={article.audio_path_full ?? null}
      />

      <main className='mx-auto max-w-4xl px-4 py-6'>
        <SentencesList
          article={article}
          answers={answers}
          submitted={submitted}
          feedbacks={feedbacks}
          loadingMap={loadingMap}
          onChangeAnswer={(id, val) => setAnswers((p) => ({ ...p, [id]: val }))}
          onSubmitOne={handleSubmitOne}
          voiceName={voiceName}
          speakingRate={speakingRate}
          isAdmin={isAdmin}
        />

        <div className='mt-8 text-center text-sm text-gray-600'>
          {allSubmitted ? '所有句子都已送出。辛苦了！' : '尚有未送出的回答'}
        </div>
      </main>
    </div>
  );
}
