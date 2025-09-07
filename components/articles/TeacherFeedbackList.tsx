'use client';

import { deleteFeedback, listFeedback } from '@/app/articles/[id]/action';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { useEffect, useState, useTransition } from 'react';

type Feedback = {
  id: string;
  created_at: string;
  sentence_id: string;
  note_md: string;
};

export function TeacherFeedbackList({
  sentenceId,
  isAdmin = false,
  refreshToken = 0, // 親が増やすと再読込
}: {
  sentenceId: string;
  isAdmin?: boolean;
  refreshToken?: number;
}) {
  const [items, setItems] = useState<Feedback[]>([]);
  const [isPending, startTransition] = useTransition();

  const load = async () => {
    const data = await listFeedback(sentenceId);
    setItems(data);
  };

  useEffect(() => {
    load();
  }, [sentenceId]);
  useEffect(() => {
    load();
  }, [refreshToken]);

  const remove = (id: string) => {
    if (!isAdmin) return;
    startTransition(async () => {
      await deleteFeedback(id);
      await load();
    });
  };

  return (
    <div className='rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>短評</h3>

      <div className='mt-3 space-y-3'>
        {items.map((f) => (
          <div key={f.id} className='rounded border p-3'>
            <div className='mb-1 grid grid-cols-[1fr_auto] items-center justify-end'>
              <div className='prose prose-sm max-w-none'>
                <MarkdownRenderer markdown={f.note_md} />
              </div>
              {isAdmin && (
                <button
                  type='button'
                  onClick={() => remove(f.id)}
                  disabled={isPending}
                  className='text-xs text-red-600 disabled:opacity-50'
                >
                  削除
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
