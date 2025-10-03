'use client';

import type { Article, FeedbackWithTags, Metrics } from '@/types/dictation';
import Link from 'next/link';
import SentenceItem from './sentence/SentenceItem';

type Props = {
  article: Article;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  feedbacks: Record<string, string>;
  loadingMap: Record<string, boolean>;
  onChangeAnswer: (id: string, val: string) => void;
  onSubmitOne: (
    sentenceId: string,
    metrics: Metrics,
    selfAssessedComprehension: number
  ) => void;
  isAdmin: boolean;
  feedbackMap: Record<string, FeedbackWithTags[]>;
};

export default function SentencesList({
  article,
  answers,
  submitted,
  feedbacks,
  loadingMap,
  onChangeAnswer,
  onSubmitOne,
  isAdmin,
  feedbackMap,
}: Props) {
  return (
    <div className='space-y-5'>
      {article.sentences.map((s) => {
        const itemsFor = feedbackMap[s.id] ?? s.teacher_feedback ?? [];
        return (
          <div key={s.id} className='space-y-2'>
            <SentenceItem
              sentence={s}
              value={answers[s.id] ?? ''}
              isSubmitted={submitted[s.id] ?? false}
              feedback={feedbacks[s.id]}
              onChange={(val) => onChangeAnswer(s.id, val)}
              onSubmit={onSubmitOne}
              submitting={loadingMap[s.id] ?? false}
              items={itemsFor}
            />
            {isAdmin && (
              <div className='flex justify-end'>
                <Link
                  href={`/admin/sentences/${s.id}/teacher_feedback`}
                  className='text-xs underline text-slate-600'
                >
                  短評を編集（管理）
                </Link>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
