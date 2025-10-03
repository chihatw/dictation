// components/articles/TeacherFeedbackList.tsx
'use client';

import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { FeedbackWithTags } from '@/types/dictation';
import { Tags } from '../tag/Tags';
import TagAdder from './TagAdder';

export function TeacherFeedbackList({
  items,
  canManage = false,
  onDelete,
  onDeleteTag,
  onAddTag,
}: {
  items: FeedbackWithTags[];
  canManage?: boolean;
  onDelete?: (feedbackId: string) => void;
  onDeleteTag?: (tagId: string) => void;
  onAddTag?: (label: string, fbId: string) => void;
}) {
  if (!items.length) return <></>;

  return (
    <div className='rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>短評</h3>
      <div className='mt-3 space-y-3'>
        {items.map((f) => (
          <div key={f.id} className='rounded border p-3'>
            <div className='mb-2 flex items-center justify-end'>
              {canManage && (
                <button
                  type='button'
                  onClick={() => onDelete?.(f.id)}
                  className='h-6 whitespace-nowrap rounded border px-2 text-xs text-red-600'
                >
                  削除
                </button>
              )}
            </div>
            <div className='prose prose-sm max-w-none'>
              <MarkdownRenderer markdown={f.note_md} />
            </div>
            <div className='mt-2 flex flex-wrap gap-2 text-pink-600'>
              <Tags
                items={f.tags}
                isAdmin={canManage}
                onDeleteTag={onDeleteTag}
              />
              {!f.tags?.length && (
                <span className='text-xs text-gray-500'>タグなし</span>
              )}
            </div>
            {canManage && (
              <TagAdder onAdd={(label) => onAddTag?.(label, f.id)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
