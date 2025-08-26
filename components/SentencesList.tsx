'use client';

import type { Article } from '@/types/dictation';
import SentenceItem from './sentence/SentenceItem';

type Props = {
  article: Article;
  answers: Record<string, string>;
  submitted: Record<string, boolean>;
  feedbacks: Record<string, string>;
  loadingMap: Record<string, boolean>;
  onChangeAnswer: (id: string, val: string) => void;
  onSubmitOne: (sentenceId: string) => void;
  voiceName: string;
  speakingRate: number;
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
          onSubmit={() => onSubmitOne(s.id)}
          submitting={loadingMap[s.id] ?? false}
        />
      ))}
    </div>
  );
}
