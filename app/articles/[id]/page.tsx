'use client';
// app/articles/[id]/page.tsx

import ArticleHeader from '@/components/ArticleHeader';
import SentencesList from '@/components/SentencesList';
import { useArticle } from '@/hooks/useArticle';
import { useJournalModal } from '@/hooks/useJournalModal';
import { supabase } from '@/lib/supabase/browser';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const role = data.user?.app_metadata?.role;
      setIsAdmin(role === 'admin');
    });
  }, []);

  const {
    article,
    journal,
    loading,
    errMsg,
    allSubmitted,
    answers,
    setAnswers,
    submitted,
    loadingMap,
    submitOne,
  } = useArticle(id);

  const { openJournalModal, JournalModalElement } = useJournalModal();

  const handleSubmitOne = async (
    sentenceId: string,
    playsCount: number,
    elapsedMsSinceItemView: number,
    elapsedMsSinceFirstPlay: number,
    selfAssessedComprehension: number
  ) => {
    const s = article?.sentences.find((x) => x.id === sentenceId);
    if (!s) return;
    const result = await submitOne(
      s,
      playsCount,
      elapsedMsSinceItemView,
      elapsedMsSinceFirstPlay,
      selfAssessedComprehension
    );

    if (result?.completed && result.articleId) {
      openJournalModal(result.articleId);
    }
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
      <ArticleHeader article={article} isAdmin={isAdmin} />

      <main className='mx-auto max-w-4xl px-4 py-6'>
        {journal && (
          <div className='rounded-xl border bg-white p-4 shadow-sm mb-4 '>
            <div className='text-sm flex gap-x-2 items-center pb-2'>
              <div className='font-bold'>學習日誌:</div>
              <div className='text-gray-500'>
                {(() => {
                  const date = new Date(journal!.created_at);
                  const y = date.getFullYear();
                  const m = date.getMonth() + 1;
                  const d = date.getDate();
                  return [y, m, d].join('/');
                })()}
              </div>
            </div>
            <div className='text-sm'>
              <div className='rounded-lg bg-slate-50 p-2 border border-slate-200 text-slate-700'>
                {journal.body.split('\n').map((line, index) => {
                  return <div key={index}>{line}</div>;
                })}
              </div>
            </div>
          </div>
        )}

        <SentencesList
          article={article}
          answers={answers}
          submitted={submitted}
          loadingMap={loadingMap}
          onChangeAnswer={(sid, val) =>
            setAnswers((p) => ({ ...p, [sid]: val }))
          }
          onSubmitOne={handleSubmitOne}
          isAdmin={isAdmin}
        />

        <div className='mt-8 text-center text-sm text-gray-600'>
          {allSubmitted ? '所有句子都已送出。辛苦了！' : '尚有未送出的回答'}
        </div>
      </main>
      {JournalModalElement}
    </div>
  );
}
