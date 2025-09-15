'use client';

import ArticleHeader from '@/components/ArticleHeader';
import SentencesList from '@/components/SentencesList';
import { useArticle } from '@/hooks/useArticle';
import { supabase } from '@/lib/supabase/browser';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  addFeedbackTag,
  deleteFeedback,
  deleteFeedbackTag,
  FeedbackWithTags,
  listFeedbackWithTagsBulkBySentence,
} from './action';

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();

  const [isAdmin, setIsAdmin] = useState(false);

  // sentenceId -> feedbacks(with tags)
  const [fbMap, setFbMap] = useState<Record<string, FeedbackWithTags[]>>({});

  // StrictMode の二重実行を避けつつ、記事IDごとに一回だけ取得
  const lastFetchedArticleId = useRef<string | null>(null);

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

  // フィードバック+タグを一括取得
  useEffect(() => {
    if (!article) return;
    if (lastFetchedArticleId.current === article.id) return;
    lastFetchedArticleId.current = article.id;

    const ids = article.sentences.map((s) => s.id);
    (async () => {
      const m = await listFeedbackWithTagsBulkBySentence(ids);
      setFbMap(m);
    })();
  }, [article]);

  // 追加の反映（楽観更新）
  const handleCreatedFeedback = (
    created: FeedbackWithTags,
    sentenceId: string
  ) => {
    setFbMap((m) => ({
      ...m,
      [sentenceId]: [...(m[sentenceId] ?? []), created], // 下に追加
    }));
  };

  // 送信・削除の反映（楽観更新）
  const handleDeleteFeedback = async (fbId: string, sentenceId: string) => {
    await deleteFeedback(fbId);
    setFbMap((m) => ({
      ...m,
      [sentenceId]: (m[sentenceId] ?? []).filter((x) => x.id !== fbId),
    }));
  };

  const handleDeleteTag = async (tagId: string, sentenceId: string) => {
    await deleteFeedbackTag(tagId);
    setFbMap((m) => ({
      ...m,
      [sentenceId]: (m[sentenceId] ?? []).map((f) => ({
        ...f,
        tags: f.tags.filter((t) => t.id !== tagId),
      })),
    }));
  };

  const handleAddTag = async (
    label: string,
    sentenceId: string,
    fbId: string
  ) => {
    if (!article) return;
    const created = await addFeedbackTag(fbId, label.trim(), article.uid);
    setFbMap((m) => ({
      ...m,
      [sentenceId]: (m[sentenceId] ?? []).map((f) =>
        f.id === fbId ? { ...f, tags: [...(f.tags ?? []), created] } : f
      ),
    }));
  };

  const handleSubmitOne = (
    sentenceId: string,
    metrics: {
      playsCount: number;
      listenedFullCount: number;
      usedPlayAll: boolean;
      elapsedMsSinceItemView: number;
      elapsedMsSinceFirstPlay: number;
    },
    selfAssessedComprehension: number
  ) => {
    const s = article?.sentences.find((x) => x.id === sentenceId);
    if (!s) return;
    // 管理者なら記事の所有者UIDを代理指定
    const targetUserId = isAdmin ? article?.uid : undefined;
    submitOne(s, metrics, selfAssessedComprehension, targetUserId);
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
          /** 重要：文ごとのマップを渡す（子で sid をキーに取り出す） */
          feedbackMap={fbMap}
          onCreatedFeedback={handleCreatedFeedback}
          onDeleteFeedback={handleDeleteFeedback}
          onDeleteTag={handleDeleteTag}
          onAddTag={handleAddTag}
        />

        <div className='mt-8 text-center text-sm text-gray-600'>
          {allSubmitted ? '所有句子都已送出。辛苦了！' : '尚有未送出的回答'}
        </div>
      </main>
    </div>
  );
}
