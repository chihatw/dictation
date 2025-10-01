'use client';
// app/articles/[id]/page.tsx

import ArticleHeader from '@/components/ArticleHeader';
import SentencesList from '@/components/SentencesList';
import { useArticle } from '@/hooks/useArticle';
import { useJournalModal } from '@/hooks/useJournalModal';
import { supabase } from '@/lib/supabase/browser';
import { FeedbackWithTags, Metrics } from '@/types/dictation';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { addFeedbackTag, deleteFeedback, deleteFeedbackTag } from './action';

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
    loading,
    errMsg,
    allSubmitted,
    answers,
    setAnswers,
    submitted,
    feedbacks,
    loadingMap,
    submitOne,
  } = useArticle(id);

  const { openJournalModal, JournalModalElement } = useJournalModal();

  // Article から都度生成。別取得は不要。
  const fbMap = useMemo<Record<string, FeedbackWithTags[]>>(() => {
    if (!article) return {};
    const m: Record<string, FeedbackWithTags[]> = {};
    for (const s of article.sentences) {
      m[s.id] = s.teacher_feedback ?? [];
    }
    return m;
  }, [article]);

  const handleDeleteFeedback = async (fbId: string) => {
    await deleteFeedback(fbId);
  };

  const handleDeleteTag = async (tagId: string) => {
    await deleteFeedbackTag(tagId);
  };

  const handleAddTag = async (label: string, fbId: string) => {
    if (!article) return;
    await addFeedbackTag(fbId, label.trim());
  };

  const handleSubmitOne = async (
    sentenceId: string,
    metrics: Metrics,
    selfAssessedComprehension: number
  ) => {
    const s = article?.sentences.find((x) => x.id === sentenceId);
    if (!s) return;
    const targetUserId = isAdmin ? article?.uid : undefined;
    const result = await submitOne(s, metrics, selfAssessedComprehension);

    if (result?.completed && result.articleId) {
      // todo 管理者はモーダルを開けるないので userId は不要のはず
      openJournalModal({ articleId: result.articleId, userId: targetUserId });
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
      <ArticleHeader
        title={article.title}
        audioPathFull={article.audio_path_full ?? null}
        isAdmin={isAdmin}
      />

      <main className='mx-auto max-w-4xl px-4 py-6'>
        {article.journal && (
          <div className='rounded-xl border bg-white p-4 shadow-sm mb-4 '>
            <div className='text-sm flex gap-x-2 items-center pb-2'>
              <div className='font-bold'>學習日誌:</div>
              <div className='text-gray-500'>
                {(() => {
                  const date = new Date(article.journal!.created_at);
                  const y = date.getFullYear();
                  const m = date.getMonth() + 1;
                  const d = date.getDate();
                  return [y, m, d].join('/');
                })()}
              </div>
            </div>
            <div className='text-sm'>
              <div className='rounded-lg bg-slate-50 p-2 border border-slate-200 text-slate-700'>
                {article.journal.body.split('\n').map((line, index) => {
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
          feedbacks={feedbacks}
          loadingMap={loadingMap}
          onChangeAnswer={(sid, val) =>
            setAnswers((p) => ({ ...p, [sid]: val }))
          }
          onSubmitOne={handleSubmitOne}
          isAdmin={isAdmin}
          /** 重要：Article 由来のマップを渡す（追加取得なし） */
          feedbackMap={fbMap}
          onDeleteFeedback={handleDeleteFeedback}
          onDeleteTag={handleDeleteTag}
          onAddTag={handleAddTag}
        />

        <div className='mt-8 text-center text-sm text-gray-600'>
          {allSubmitted ? '所有句子都已送出。辛苦了！' : '尚有未送出的回答'}
        </div>
      </main>
      {JournalModalElement}
    </div>
  );
}
