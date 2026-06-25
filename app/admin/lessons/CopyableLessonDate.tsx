'use client';

import { useCallback, useState } from 'react';

type CopyableLessonDateProps = {
  lessonId: string;
  label: string;
};

export default function CopyableLessonDate({
  lessonId,
  label,
}: CopyableLessonDateProps) {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  );

  const copyLessonId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(lessonId);
      setCopyStatus('copied');
      window.setTimeout(() => setCopyStatus('idle'), 1800);
    } catch {
      setCopyStatus('error');
      window.setTimeout(() => setCopyStatus('idle'), 2500);
    }
  }, [lessonId]);

  const title =
    copyStatus === 'copied'
      ? 'レッスンIDをコピーしました'
      : copyStatus === 'error'
        ? 'コピーに失敗しました'
        : 'クリックしてレッスンIDをコピー';

  return (
    <button
      type='button'
      onClick={copyLessonId}
      className='rounded text-left hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 hover:cursor-pointer'
      title={title}
      aria-label={`${label}。${title}`}
    >
      {copyStatus === 'copied' ? 'コピーしました' : label}
    </button>
  );
}
