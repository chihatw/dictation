'use client';

import { toPublicUrl } from '@/lib/tts/publicUrl';
import { Article } from '@/types/dictation';
import { memo, useMemo, useRef, useState } from 'react';

import { TeacherFeedbackPanel } from '../articles/TeacherFeedbackPanel';
import { AIFeedbackPanel } from './parts/AIFeedbackPanel';
import { AnswerField } from './parts/AnswerField';
import { HeaderRow } from './parts/HeaderRow';
import { SelfAssessmentSelectorCompact } from './parts/SelfAssessmentSelector';
import { SubmitButton } from './parts/SubmitButton';

type SentenceItemProps = {
  sentence: Article['sentences'][number];
  value: string;
  isSubmitted: boolean;
  submitting: boolean;
  onChange: (v: string) => void;
  onSubmit: (
    sentenceId: string,
    playsCount: number,
    elapsedMsSinceItemView: number,
    elapsedMsSinceFirstPlay: number,
    selfAssessedComprehension: number
  ) => void;
};

function SentenceItemBase({
  sentence,
  value,
  isSubmitted,
  onChange,
  onSubmit,
  submitting,
}: SentenceItemProps) {
  const [playsCount, setPlaysCount] = useState(0);
  const [firstPlayAt, setFirstPlayAt] = useState<number | null>(null);
  const [selfAssessedComprehension, setSelfAssessedComprehension] = useState(0);
  const itemViewAt = useRef(Date.now());

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
      playsCount,
      Date.now() - itemViewAt.current,
      firstPlayAt ? Date.now() - firstPlayAt : 0,
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

      <AIFeedbackPanel
        show={isSubmitted && !!sentence.submission?.feedback_md}
        sentence={sentence}
        selfAssessedComprehension={displaySac}
      />
      <div className='mt-3'>
        <TeacherFeedbackPanel submission={sentence.submission} />
      </div>
    </section>
  );
}

export const SentenceItem = memo(SentenceItemBase);
export default SentenceItem;
