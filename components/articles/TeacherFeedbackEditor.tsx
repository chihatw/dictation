'use client';

import { setSubmissionTeacherFeedback } from '@/app/admin/submissions/[id]/teacher_feedback/actions';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import type { Article } from '@/types/dictation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Tags } from '../tag/Tags';
import TagAdder from './TagAdder';

type TagItem = NonNullable<
  Article['sentences'][number]['submission']
>['tags'][number];

export function TeacherFeedbackEditor({
  submissionId,
  initialTeacherFeedback,
  tags,
  canManage = false,
  onSubmitted,
  onDeleted,
  onAddTag,
  onDeleteTag,
}: {
  submissionId: string;
  initialTeacherFeedback?: string | null;
  tags: TagItem[];
  canManage?: boolean;
  onSubmitted?: (next: string | null) => void;
  onDeleted?: () => void;
  onAddTag?: (label: string) => void;
  onDeleteTag?: (tagId: string) => void;
}) {
  const [draft, setDraft] = useState<string>(initialTeacherFeedback ?? '');
  const [isPending, startTransition] = useTransition();

  useEffect(
    () => setDraft(initialTeacherFeedback ?? ''),
    [initialTeacherFeedback]
  );

  const trimmed = draft.trim();
  const initialTrimmed = (initialTeacherFeedback ?? '').trim();
  const isDirty = trimmed !== initialTrimmed;

  const canSave = useMemo(
    () => !!trimmed && isDirty && !isPending,
    [trimmed, isDirty, isPending]
  );
  const canDelete = useMemo(
    () => !!initialTrimmed && !isPending,
    [initialTrimmed, isPending]
  );

  const submit = () => {
    if (!canSave) return;
    startTransition(async () => {
      await setSubmissionTeacherFeedback(submissionId, trimmed);
      onSubmitted?.(trimmed);
    });
  };

  const del = () => {
    if (!canDelete) return;
    startTransition(async () => {
      await setSubmissionTeacherFeedback(submissionId, null);
      setDraft('');
      onDeleted?.();
      onSubmitted?.(null);
    });
  };

  const hasFeedback = !!trimmed;
  const hasTags = tags.length > 0;

  if (!hasFeedback && !hasTags && !canManage) return null;

  return (
    <div className='rounded-lg border p-3 space-y-3'>
      <h3 className='text-sm font-semibold'>短評</h3>

      {/* 本文編集 + プレビュー */}
      <div className='grid gap-3 md:grid-cols-2'>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) =>
            (e.metaKey || e.ctrlKey) && e.key === 'Enter' && submit()
          }
          placeholder='例：発音が明瞭で良いです。助詞「は／が」を意識しましょう。'
          className='min-h-[140px] w-full rounded border p-2 text-sm font-mono'
        />
        <div className='prose prose-sm max-w-none rounded border p-2'>
          <MarkdownRenderer markdown={trimmed || '_（プレビュー）_'} />
        </div>
      </div>

      {/* 保存／削除 */}
      <div className='flex items-center justify-between'>
        <button
          type='button'
          disabled={!canSave}
          onClick={submit}
          className='rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50'
        >
          保存
        </button>
        {canDelete && (
          <button
            type='button'
            onClick={del}
            disabled={isPending}
            className='h-7 whitespace-nowrap rounded border px-3 text-xs text-red-600 disabled:opacity-50'
          >
            短評を削除
          </button>
        )}
      </div>

      {/* タグ */}
      <div className='pt-2 border-t'>
        <div className='text-sm font-semibold'>タグ</div>
        <div className='mt-2 flex flex-wrap gap-2 text-pink-600'>
          <Tags items={tags} isAdmin={canManage} onDeleteTag={onDeleteTag} />
          {!tags.length && (
            <span className='text-xs text-gray-500'>タグなし</span>
          )}
        </div>
        {canManage && (
          <div className='mt-2'>
            <TagAdder onAdd={(label) => onAddTag?.(label)} />
          </div>
        )}
      </div>
    </div>
  );
}
