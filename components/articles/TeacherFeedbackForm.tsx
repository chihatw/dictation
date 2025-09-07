'use client';

import { addFeedback } from '@/app/articles/[id]/action';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { useState, useTransition } from 'react';

export function TeacherFeedbackForm({
  sentenceId,
  onSubmitted,
}: {
  sentenceId: string;
  onSubmitted?: () => void; // 送信完了時に親へ通知
}) {
  const [draft, setDraft] = useState('');
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    const md = draft.trim();
    if (!md) return;
    startTransition(async () => {
      await addFeedback(sentenceId, md);
      setDraft('');
      onSubmitted?.();
    });
  };

  return (
    <div className='rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>Teacher Feedback（入力）</h3>

      {/* 入力欄 + プレビュー */}
      <div className='mt-2 grid gap-3 md:grid-cols-2'>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder='Markdown で入力（**太字**、*斜体*、- 箇条書き など）'
          className='min-h-[160px] w-full rounded border p-2 font-mono text-sm'
        />
        <div className='prose prose-sm max-w-none rounded border p-2'>
          <MarkdownRenderer markdown={draft || '_（プレビュー）_'} />
        </div>
      </div>

      <div className='mt-2'>
        <button
          type='button'
          onClick={submit}
          disabled={isPending || !draft.trim()}
          className='rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50'
        >
          追加
        </button>
      </div>
    </div>
  );
}
