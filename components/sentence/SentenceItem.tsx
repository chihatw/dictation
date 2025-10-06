'use client';

import { toPublicUrl } from '@/lib/tts/publicUrl';
import { FeedbackWithTags, Metrics, Sentence } from '@/types/dictation';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

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
  onChange: (val: string) => void;
  onSubmit: (
    sentenceId: string,
    metrics: Metrics,
    selfAssessedComprehension: number
  ) => void; // 型を差し替え
  submitting?: boolean;
  items: FeedbackWithTags[];
};

function SentenceItemBase({
  sentence,
  value,
  isSubmitted,
  feedback,
  onChange,
  onSubmit,
  submitting,
  items,
}: SentenceItemProps) {
  const [localItems, setLocalItems] = useState<FeedbackWithTags[]>(items);
  const [playsCount, setPlaysCount] = useState(0);
  const [firstPlayAt, setFirstPlayAt] = useState<number | null>(null);
  const [selfAssessedComprehension, setSelfAssessedComprehension] = useState(0);
  const itemViewAt = useRef(Date.now());

  useEffect(() => {
    setLocalItems(items);
  }, [sentence.id, items]);

  const displaySac = isSubmitted
    ? selfAssessedComprehension ||
      sentence.submission?.self_assessed_comprehension ||
      0
    : selfAssessedComprehension || 0;

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
        selfAssessedComprehension={displaySac}
      />
      <AdminFeedbackBlock items={localItems} mode='view' />
    </section>
  );
}

export const SentenceItem = memo(SentenceItemBase);
export default SentenceItem;
