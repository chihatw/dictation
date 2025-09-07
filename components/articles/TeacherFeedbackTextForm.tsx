'use client';

import {
  addFeedback,
  deleteFeedback,
  listFeedback,
} from '@/app/articles/[id]/action';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { useEffect, useState, useTransition } from 'react';

type Feedback = {
  id: string;
  created_at: string;
  sentence_id: string;
  note_md: string;
};

export function TeacherFeedbackTextForm({
  sentenceId,
}: {
  sentenceId: string;
}) {
  const [items, setItems] = useState<Feedback[]>([]);
  const [draft, setDraft] = useState('');
  const [isPending, startTransition] = useTransition();

  // 初回ロード
  useEffect(() => {
    (async () => {
      const data = await listFeedback(sentenceId);
      setItems(data);
    })();
  }, [sentenceId]);

  const refresh = async () => {
    const data = await listFeedback(sentenceId);
    setItems(data);
  };

  const submit = () => {
    if (!draft.trim()) return;
    startTransition(async () => {
      await addFeedback(sentenceId, draft.trim());
      setDraft('');
      await refresh();
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteFeedback(id);
      await refresh();
    });
  };

  return (
    <div className='mt-4 rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>Teacher Feedback</h3>

      {/* 入力欄 + プレビュー */}
      <div className='mt-2 grid gap-3 md:grid-cols-2'>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder='Markdown で入力してください（**太字**、*斜体*、- 箇条書き など）'
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

      {/* 一覧 */}
      <div className='mt-4 space-y-3'>
        <div className='text-xs text-gray-500'>合計 {items.length} 件</div>
        {items.map((f) => (
          <div key={f.id} className='rounded border p-3'>
            <div className='mb-1 flex items-center justify-between'>
              <time className='text-xs text-gray-500'>
                {new Date(f.created_at).toLocaleString()}
              </time>
              <button
                type='button'
                onClick={() => remove(f.id)}
                className='text-xs text-red-600'
              >
                削除
              </button>
            </div>
            <div className='prose prose-sm max-w-none'>
              <MarkdownRenderer markdown={f.note_md} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
