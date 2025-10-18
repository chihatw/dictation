'use client';

import type { ArticleWithSentences } from '@/types/dictation';
import Link from 'next/link';
import SentenceItem from './sentence/SentenceItem';

type Props = {
  article: ArticleWithSentences;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  loadingMap: Record<string, boolean>;
  onChangeAnswer: (id: string, val: string) => void;
  onSubmitOne: (
    sentenceId: string,
    playsCount: number,
    elapsedMsSinceItemView: number,
    elapsedMsSinceFirstPlay: number,
    selfAssessedComprehension: number
  ) => void;
  isAdmin: boolean;
  aiFeedbacks?: Record<string, string>;
};

export default function SentencesList({
  article,
  answers,
  submitted,
  loadingMap,
  onChangeAnswer,
  onSubmitOne,
  isAdmin,
  aiFeedbacks,
}: Props) {
  return (
    <div className='space-y-5'>
      {article.sentences.map((s) => {
        return (
          <div key={s.id} className='space-y-2'>
            <SentenceItem
              sentence={s}
              value={answers[s.id] ?? ''}
              isSubmitted={submitted[s.id] ?? false}
              onChange={(val) => onChangeAnswer(s.id, val)}
              onSubmit={onSubmitOne}
              submitting={loadingMap[s.id] ?? false}
              aiFeedback={aiFeedbacks?.[s.id] ?? ''}
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
