'use client';

import { addFeedbackWithTags } from '@/app/admin/submissions/[id]/teacher_feedback/actions';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { FeedbackWithTags } from '@/types/dictation';
import { useState, useTransition } from 'react';

export function TeacherFeedbackForm({
  submissionId,
  onSubmitted,
}: {
  submissionId: string;
  onSubmitted?: (created: FeedbackWithTags) => void;
}) {
  const [draft, setDraft] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    const md = draft.trim();
    if (!md) return;
    startTransition(async () => {
      const created = await addFeedbackWithTags(submissionId, md);
      setDraft('');
      onSubmitted?.(created);
    });
  };

  return (
    <div className='rounded-lg border p-3'>
      <h4 className='text-sm font-semibold'>短評を追加</h4>
      <div className='mt-2 grid gap-3 md:grid-cols-2'>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className='min-h-[140px] w-full rounded border p-2 text-sm font-mono'
        />
        <div className='prose prose-sm max-w-none rounded border p-2'>
          <MarkdownRenderer markdown={draft || '_（プレビュー）_'} />
        </div>
      </div>
      <button
        type='button'
        disabled={isPending || !draft.trim()}
        onClick={submit}
        className='mt-2 rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50'
      >
        追加
      </button>
    </div>
  );
}
