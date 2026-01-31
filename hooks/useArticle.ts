'use client';

import { createFeedbackAndLogAction } from '@/app/articles/[id]/action';
import { fetchArticleWithSentences } from '@/lib/dictation/queries';
import {
  ArticleWithSentences,
  Journal,
  SentenceWithSubmission,
} from '@/types/dictation';

import { useCallback, useEffect, useMemo, useState } from 'react';

export function useArticle(articleId: string | undefined) {
  const [article, setArticle] = useState<ArticleWithSentences | null>(null);
  const [journal, setJournal] = useState<Journal | null>(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const [aiFeedbacks, setAiFeedbacks] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!articleId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      setErrMsg(null);
      const data = await fetchArticleWithSentences(articleId);
      if (!mounted) return;

      if (!data) {
        setErrMsg('記事の取得に失敗しました。');
        setArticle(null);
        setJournal(null);
        setLoading(false);
        return;
      }

      setArticle(data.article);
      setJournal(data.journal);

      const nextAnswers: Record<string, string> = {};
      const nextSubmitted: Record<string, boolean> = {};
      const nextAi: Record<string, string> = {};

      for (const s of data.article.sentences ?? []) {
        const one = s.submission ?? null;
        nextAnswers[s.id] = one?.answer ?? '';
        nextSubmitted[s.id] = !!one;

        if (one?.ai_feedback_md) nextAi[s.id] = one.ai_feedback_md as string;
      }
      setAnswers(nextAnswers);
      setSubmitted(nextSubmitted);
      setAiFeedbacks(nextAi);

      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [articleId]);

  const allSubmitted = useMemo(
    () => article?.sentences.every((s) => submitted[s.id]) ?? false,
    [submitted, article?.sentences],
  );

  const submitOne = useCallback(
    async (
      s: SentenceWithSubmission,
      plays_count: number,
      elapsed_ms_since_item_view: number,
      elapsed_ms_since_first_play: number,
      selfAssessedComprehension: number,
    ) => {
      const val = (answers[s.id] ?? '').trim();
      if (!val) return;
      if (!window.confirm('送出後不可再編輯')) return;

      setSubmitted((old) => ({ ...old, [s.id]: true }));
      setLoadingMap((old) => ({ ...old, [s.id]: true }));

      const res = await createFeedbackAndLogAction({
        sentenceId: s.id,
        sentenceScript: s.content,
        userAnswer: val,
        playsCount: plays_count,
        elapsedMsSinceItemView: elapsed_ms_since_item_view,
        elapsedMsSinceFirstPlay: elapsed_ms_since_first_play,
        selfAssessedComprehension,
      });

      try {
        if (!res?.ok) {
          setSubmitted((o) => ({ ...o, [s.id]: false }));
          alert(res.error ?? '保存に失敗しました。');
        } else {
          setAiFeedbacks((o) => ({ ...o, [s.id]: res.aiFeedback || '' }));
          return;
        }
      } finally {
        setLoadingMap((o) => ({ ...o, [s.id]: false }));
      }
    },
    [answers],
  );

  return {
    // データ
    article,
    journal,
    loading,
    errMsg,
    // 派生
    allSubmitted,
    // 入力状態
    answers,
    setAnswers,
    submitted,
    loadingMap,
    aiFeedbacks,
    // 動作
    submitOne,
  };
}
