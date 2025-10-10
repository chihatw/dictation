// components/articles/AdminTeacherFeedbackClient.tsx
'use client';

import {
  addFeedbackTag,
  deleteFeedbackTag,
} from '@/app/admin/submissions/[id]/teacher_feedback/actions';
import type { RpcArticle } from '@/types/dictation';
import { useCallback, useState, useTransition } from 'react';
import { TeacherFeedbackEditor } from './TeacherFeedbackEditor';

type Props = {
  submission: NonNullable<RpcArticle['sentences'][number]['submission']>;
};

export function AdminTeacherFeedbackClient({ submission }: Props) {
  const [teacherFeedback, setTeacherFeedback] = useState(
    submission.teacher_feedback ?? ''
  );
  const [tags, setTags] = useState(submission.tags ?? []);
  const [, startTransition] = useTransition();

  const onDeleteTag = useCallback((tid: string) => {
    startTransition(async () => {
      setTags((prev) => prev.filter((t) => t.id !== tid));
      await deleteFeedbackTag(tid);
    });
  }, []);

  const onAddTag = useCallback(
    (label: string) => {
      startTransition(async () => {
        const temp = {
          id: `temp-${Date.now()}`,
          created_at: new Date().toISOString(),
          submission_id: submission.id,
          tag_master_id: null,
          label,
        };
        setTags((prev) => [...prev, temp]);
        try {
          await addFeedbackTag(submission.id, label);
        } catch {
          setTags((prev) => prev.filter((t) => t.id !== temp.id)); // ロールバック
        }
      });
    },
    [submission.id]
  );

  return (
    <div className='mt-4 '>
      <TeacherFeedbackEditor
        submissionId={submission.id}
        initialTeacherFeedback={teacherFeedback}
        tags={tags}
        canManage={true}
        onSubmitted={(next) => setTeacherFeedback(next ?? '')}
        onDeleted={() => setTeacherFeedback('')}
        onAddTag={onAddTag}
        onDeleteTag={onDeleteTag}
      />
    </div>
  );
}
