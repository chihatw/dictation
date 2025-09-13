'use client';

import { toPublicUrl } from '@/lib/tts/publicUrl';
import { Sentence } from '@/types/dictation';
import { memo, useMemo, useRef, useState } from 'react';

import { FeedbackWithTags } from '@/app/articles/[id]/action';
import { AdminFeedbackBlock } from '../articles/AdminFeedbackBlock';
import { AnswerField } from './parts/AnswerField';
import { FeedbackPanel } from './parts/FeedbackPanel';
import { HeaderRow } from './parts/HeaderRow';
import { SelfAssessmentSelectorCompact } from './parts/SelfAssessmentSelector';
import { SubmitButton } from './parts/SubmitButton';

export type SentenceItemProps = {
  sentence: Sentence;
  value: string;
  isSubmitted: boolean;
  feedback?: string | null;
  voiceName: string;
  speakingRate: number;
  onChange: (val: string) => void;
  onSubmit: (
    sentenceId: string,
    metrics: {
      playsCount: number;
      listenedFullCount: number;
      usedPlayAll: boolean;
      elapsedMsSinceItemView: number;
      elapsedMsSinceFirstPlay: number;
    },
    selfAssessedComprehension: number
  ) => void; // 型を差し替え
  submitting?: boolean;
  isAdmin?: boolean;
  items: FeedbackWithTags[];
  onCreated?: (created: FeedbackWithTags) => void;
  onDelete?: (feedbackId: string) => void;
  onDeleteTag?: (tagId: string) => void;
  onAddTag?: (label: string, feedbackId: string) => void;
};

function SentenceItemBase({
  sentence,
  value,
  isSubmitted,
  feedback,
  voiceName,
  speakingRate,
  onChange,
  onSubmit,
  submitting,
  isAdmin = false,
  items,
  onCreated,
  onDelete,
  onDeleteTag,
  onAddTag,
}: SentenceItemProps) {
  const [playsCount, setPlaysCount] = useState(0);
  const [firstPlayAt, setFirstPlayAt] = useState<number | null>(null);
  const [selfAssessedComprehension, setSelfAssessedComprehension] = useState(0);
  const itemViewAt = useRef(Date.now());

  const handlePlay = () => {
    setPlaysCount((c) => c + 1);
    if (!firstPlayAt) setFirstPlayAt(Date.now());
  };

  const canSubmit = useMemo(
    () =>
      !isSubmitted &&
      !!value.trim() &&
      !submitting &&
      [1, 2, 3, 4].includes(selfAssessedComprehension),
    [isSubmitted, value, submitting, selfAssessedComprehension]
  );

  const audioUrl = sentence.audio_path
    ? toPublicUrl(sentence.audio_path)
    : undefined;

  const handleSubmit = async () => {
    onSubmit(
      sentence.id,
      {
        playsCount,
        listenedFullCount: playsCount,
        usedPlayAll: false,
        elapsedMsSinceItemView: Date.now() - itemViewAt.current,
        elapsedMsSinceFirstPlay: firstPlayAt ? Date.now() - firstPlayAt : 0,
      },
      selfAssessedComprehension
    );
  };

  return (
    <section
      className='rounded-xl border bg-white p-4 shadow-sm'
      aria-labelledby={`sentence-${sentence.id}-title`}
    >
      <HeaderRow
        id={`sentence-${sentence.id}-title`}
        seq={sentence.seq}
        audioUrl={audioUrl}
        tts={{ text: sentence.content, voiceName, speakingRate }}
        disabled={!!submitting}
        onPlay={handlePlay}
      />

      <div className='mt-3'>
        {isSubmitted ? (
          <AnswerField.ReadOnly value={value} label='你的回答（已送出）' />
        ) : (
          <AnswerField.Editable
            value={value}
            onChange={onChange}
            placeholder='輸入你聽到的日文'
            readOnly={!!submitting}
            ariaDescribedBy={`sentence-${sentence.id}-hint`}
          />
        )}
      </div>

      {/* 自己評価の選択肢を追加 */}
      {!isSubmitted && (
        <div className='mt-3'>
          <SelfAssessmentSelectorCompact
            value={selfAssessedComprehension}
            onChange={setSelfAssessedComprehension}
            describedById={`sentence-${sentence.id}-comp-hint`}
          />
        </div>
      )}

      <div className='mt-3 flex justify-end'>
        <SubmitButton
          loading={!!submitting}
          disabled={!canSubmit}
          onClick={handleSubmit}
        />
      </div>

      <FeedbackPanel
        show={isSubmitted && !!feedback}
        feedback={feedback ?? ''}
        transcript={sentence.content}
        ariaLiveId={`sentence-${sentence.id}-feedback`}
        selfAssessedComprehension={sentence.self_assessed_comprehension}
      />
      <AdminFeedbackBlock
        items={items}
        sentenceId={sentence.id}
        isAdmin={isAdmin}
        onCreated={onCreated}
        onDelete={onDelete}
        onDeleteTag={onDeleteTag}
        onAddTag={onAddTag}
      />
    </section>
  );
}

export const SentenceItem = memo(SentenceItemBase);
export default SentenceItem;
