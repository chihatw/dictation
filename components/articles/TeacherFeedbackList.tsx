'use client';

import { FeedbackWithTags } from '@/app/articles/[id]/action';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import TagAdder from './TagAdder';

export function TeacherFeedbackList({
  items,
  isAdmin = false,
  onDelete,
  onDeleteTag,
  onAddTag,
}: {
  items: FeedbackWithTags[];
  isAdmin?: boolean;
  onDelete?: (feedbackId: string) => void;
  onDeleteTag?: (tagId: string) => void;
  onAddTag?: (label: string, fbId: string) => void;
}) {
  if (items.length === 0) {
    return <></>;
  }

  return (
    <div className='rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>短評</h3>
      <div className='mt-3 space-y-3'>
        {items.map((f) => (
          <div key={f.id} className='rounded border p-3'>
            {/* 行ヘッダ：日時＋削除 */}
            <div className='mb-2 flex items-center justify-end'>
              {isAdmin && (
                <button
                  type='button'
                  onClick={() => onDelete?.(f.id)}
                  className='h-6 whitespace-nowrap rounded border px-2 text-xs text-red-600'
                >
                  削除
                </button>
              )}
            </div>

            {/* 本文 */}
            <div className='prose prose-sm max-w-none'>
              <MarkdownRenderer markdown={f.note_md} />
            </div>

            {/* タグ列 */}
            <div className='mt-2 flex flex-wrap gap-2'>
              {(f.tags ?? []).map((t) => (
                <span
                  key={t.id}
                  className='inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs'
                >
                  {t.label}
                  {isAdmin && (
                    <button
                      type='button'
                      onClick={() => onDeleteTag?.(t.id)}
                      className='text-gray-500 hover:text-red-600'
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {!f.tags?.length && (
                <span className='text-xs text-gray-500'>タグなし</span>
              )}
            </div>

            {/* 追加入力（管理者のみ表示） */}
            {isAdmin && <TagAdder onAdd={(label) => onAddTag?.(label, f.id)} />}
          </div>
        ))}
      </div>
    </div>
  );
}
