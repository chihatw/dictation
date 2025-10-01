'use client';

import type { Article, FeedbackWithTags, Metrics } from '@/types/dictation';
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
  onDeleteFeedback?: (fbId: string) => Promise<void>;
  onDeleteTag?: (tagId: string) => Promise<void>;
  onAddTag?: (label: string, fbId: string) => void;
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
  onDeleteFeedback,
  onDeleteTag,
  onAddTag,
}: Props) {
  return (
    <div className='space-y-5'>
      {article.sentences.map((s) => {
        const itemsFor = feedbackMap[s.id] ?? s.teacher_feedback ?? [];
        return (
          <SentenceItem
            key={s.id}
            sentence={s}
            value={answers[s.id] ?? ''}
            isSubmitted={submitted[s.id] ?? false}
            feedback={feedbacks[s.id]}
            onChange={(val) => onChangeAnswer(s.id, val)}
            onSubmit={onSubmitOne}
            submitting={loadingMap[s.id] ?? false}
            isAdmin={isAdmin}
            items={itemsFor}
            onDelete={(fbId) => onDeleteFeedback?.(fbId)}
            onDeleteTag={(tagId) => onDeleteTag?.(tagId)}
            onAddTag={(label, fbId) => onAddTag?.(label, fbId)}
          />
        );
      })}
    </div>
  );
}
