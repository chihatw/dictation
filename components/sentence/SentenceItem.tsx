'use client';

import { toPublicUrl } from '@/lib/tts/publicUrl';
import { Sentence } from '@/types/dictation';
import { memo, useMemo } from 'react';
import { AnswerField } from './parts/AnswerField';
import { FeedbackPanel } from './parts/FeedbackPanel';
import { HeaderRow } from './parts/HeaderRow';
import { SubmitButton } from './parts/SubmitButton';

export type SentenceItemProps = {
  sentence: Sentence;
  value: string;
  isSubmitted: boolean;
  feedback?: string | null;
  voiceName: string;
  speakingRate: number;
  onChange: (val: string) => void;
  onSubmit: (sentenceId: string) => void;
  submitting?: boolean;
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
}: SentenceItemProps) {
  const canSubmit = useMemo(
    () => !isSubmitted && !!value.trim() && !submitting,
    [isSubmitted, value, submitting]
  );

  const audioUrl = sentence.audio_path
    ? toPublicUrl(sentence.audio_path)
    : undefined;

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

      <div className='mt-3 flex justify-end'>
        <SubmitButton
          loading={!!submitting}
          disabled={!canSubmit}
          onClick={() => onSubmit(sentence.id)}
        />
      </div>

      <FeedbackPanel
        show={isSubmitted && !!feedback}
        feedback={feedback ?? ''}
        transcript={sentence.content}
        ariaLiveId={`sentence-${sentence.id}-feedback`}
      />
    </section>
  );
}

export const SentenceItem = memo(SentenceItemBase);
export default SentenceItem;
