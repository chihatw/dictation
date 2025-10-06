'use client';

import type { Article, Metrics, Tag } from '@/types/dictation';
import Link from 'next/link';
import SentenceItem from './sentence/SentenceItem';

type Props = {
  article: Article;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  loadingMap: Record<string, boolean>;
  onChangeAnswer: (id: string, val: string) => void;
  onSubmitOne: (
    sentenceId: string,
    metrics: Metrics,
    selfAssessedComprehension: number
  ) => void;
  isAdmin: boolean;
};

export default function SentencesList({
  article,
  answers,
  submitted,
  loadingMap,
  onChangeAnswer,
  onSubmitOne,
  isAdmin,
}: Props) {
  return (
    <div className='space-y-5'>
      {article.sentences.map((s) => {
        const tags: Tag[] = s.submission?.tags ?? []; // ← 常に配列
        const feedback = s.submission?.feedback_md ?? null; // ← 文字列 or null
        const teacherFeedback = s.submission?.teacher_feedback ?? null; // ← 文字列 or null

        return (
          <div key={s.id} className='space-y-2'>
            <SentenceItem
              sentence={s}
              value={answers[s.id] ?? ''}
              isSubmitted={submitted[s.id] ?? false}
              feedback={feedback}
              teacherFeedback={teacherFeedback}
              tags={tags} // ← items ではなく tags を渡す
              onChange={(val) => onChangeAnswer(s.id, val)}
              onSubmit={onSubmitOne}
              submitting={loadingMap[s.id] ?? false}
            />
            {isAdmin && (
              <div className='flex justify-end'>
                <Link
                  href={`/admin/submissions/${s.submission?.id}/teacher_feedback`}
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
