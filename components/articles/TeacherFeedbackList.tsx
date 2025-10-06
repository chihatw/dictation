// components/articles/TeacherFeedbackList.tsx
'use client';

import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { Tag } from '@/types/dictation';
import { Tags } from '../tag/Tags';
import TagAdder from './TagAdder';

export function TeacherFeedbackList({
  tags,
  feedback,
  canManage = false,
  onDeleteTag,
  onAddTag,
}: {
  tags: Tag[];
  feedback: string | null;
  canManage?: boolean;
  onDeleteTag?: (tagId: string) => void;
  onAddTag?: (label: string) => void;
}) {
  const hasFeedback = !!feedback?.trim();
  const hasTags = tags.length > 0;

  if (!hasFeedback && !hasTags && !canManage) return null;

  return (
    <div className='rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>短評</h3>

      {/* 短評本文 */}
      <div className='mt-3 prose prose-sm max-w-none'>
        <MarkdownRenderer markdown={feedback || '_（未入力）_'} />
      </div>

      {/* タグ一覧 */}
      <div className='mt-3 flex flex-wrap gap-2 text-pink-600'>
        <Tags items={tags} isAdmin={canManage} onDeleteTag={onDeleteTag} />
        {!tags.length && (
          <span className='text-xs text-gray-500'>タグなし</span>
        )}
      </div>

      {/* タグ追加 */}
      {canManage && <TagAdder onAdd={(label) => onAddTag?.(label)} />}
    </div>
  );
}
