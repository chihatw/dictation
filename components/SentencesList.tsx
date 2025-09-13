'use client';

import { FeedbackWithTags } from '@/app/articles/[id]/action';
import type { Article } from '@/types/dictation';
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
    metrics: {
      playsCount: number;
      listenedFullCount: number;
      usedPlayAll: boolean;
      elapsedMsSinceItemView: number;
      elapsedMsSinceFirstPlay: number;
    },
    selfAssessedComprehension: number
  ) => void;
  voiceName: string;
  speakingRate: number;
  isAdmin: boolean;
  feedbackMap: Record<string, FeedbackWithTags[]>;
  onCreatedFeedback?: (created: FeedbackWithTags, sentenceId: string) => void;
  onDeleteFeedback?: (fbId: string, sentenceId: string) => Promise<void>;
  onDeleteTag?: (tagId: string, sentenceId: string) => Promise<void>;
  onAddTag?: (label: string, sentenceId: string, fbId: string) => void;
};

export default function SentencesList({
  article,
  answers,
  submitted,
  feedbacks,
  loadingMap,
  onChangeAnswer,
  onSubmitOne,
  voiceName,
  speakingRate,
  isAdmin,
  feedbackMap,
  onCreatedFeedback,
  onDeleteFeedback,
  onDeleteTag,
  onAddTag,
}: Props) {
  return (
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
          onChange={(val) => onChangeAnswer(s.id, val)}
          onSubmit={onSubmitOne}
          submitting={loadingMap[s.id] ?? false}
          isAdmin={isAdmin}
          items={feedbackMap[s.id] ?? []}
          onCreated={(created) => onCreatedFeedback?.(created, s.id)}
          onDelete={(fbId) => onDeleteFeedback?.(fbId, s.id)}
          onDeleteTag={(tagId) => onDeleteTag?.(tagId, s.id)}
          onAddTag={(label, fbId) => onAddTag?.(label, s.id, fbId)}
        />
      ))}
    </div>
  );
}
