// components/articles/TeacherFeedbackPanel.tsx
'use client';

import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { SubmissionWithTags } from '@/types/dictation';
import { Tags } from '../tag/Tags';

export function TeacherFeedbackPanel({
  submission,
}: {
  submission: SubmissionWithTags | null;
}) {
  const teacherFeedback = submission?.teacher_feedback_md;
  const tags = submission?.tags || [];
  const hasFeedback = !!teacherFeedback?.trim();
  const hasTags = tags.length > 0;

  if (!hasFeedback && !hasTags) return null;

  return (
    <div className='rounded-lg border p-3'>
      <h3 className='text-sm font-semibold'>短評</h3>

      {/* 短評本文 */}
      <div className='mt-3 prose prose-sm max-w-none'>
        <MarkdownRenderer markdown={teacherFeedback || '_（未入力）_'} />
      </div>

      {/* タグ一覧 */}
      <div className='mt-3 flex flex-wrap gap-2 text-pink-600'>
        <Tags items={tags} />
        {!hasTags && <span className='text-xs text-gray-500'>タグなし</span>}
      </div>
    </div>
  );
}
