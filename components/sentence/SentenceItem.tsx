'use client';

import { createLogAction } from '@/app/articles/[id]/createLogAction';
import { toPublicUrl } from '@/lib/tts/publicUrl';
import { Sentence } from '@/types/dictation';
import { memo, useMemo, useRef, useState } from 'react';
import { TeacherFeedbackTextForm } from '../articles/TeacherFeedbackTextForm';
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
  isAdmin?: boolean;
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
}: SentenceItemProps) {
  const [playsCount, setPlaysCount] = useState(0);
  const [firstPlayAt, setFirstPlayAt] = useState<number | null>(null);
  const itemViewAt = useRef(Date.now());

  const handlePlay = () => {
    setPlaysCount((c) => c + 1);
    if (!firstPlayAt) setFirstPlayAt(Date.now());
  };

  const canSubmit = useMemo(
    () => !isSubmitted && !!value.trim() && !submitting,
    [isSubmitted, value, submitting]
  );

  const audioUrl = sentence.audio_path
    ? toPublicUrl(sentence.audio_path)
    : undefined;

  const handleSubmit = async () => {
    await createLogAction({
      sentenceId: sentence.id,
      answer: value,
      playsCount,
      listenedFullCount: playsCount,
      usedPlayAll: false,
      elapsedMsSinceItemView: Date.now() - itemViewAt.current,
      elapsedMsSinceFirstPlay: firstPlayAt ? Date.now() - firstPlayAt : 0,
    });

    onSubmit(sentence.id); // 元のsubmitOne呼び出し
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
      />
      {isAdmin && <TeacherFeedbackTextForm sentenceId={sentence.id} />}
    </section>
  );
}

export const SentenceItem = memo(SentenceItemBase);
export default SentenceItem;
