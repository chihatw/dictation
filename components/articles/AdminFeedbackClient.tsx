// components/articles/AdminFeedbackClient.tsx
'use client';

import type { Tag } from '@/types/dictation';
import { useState, useTransition } from 'react';
import { AdminFeedbackBlock } from './AdminFeedbackBlock';

// サーバーアクションを直接 import
import {
  addFeedbackTag,
  deleteFeedbackTag,
  setSubmissionTeacherFeedback,
} from '@/app/admin/submissions/[id]/teacher_feedback/actions';

export function AdminFeedbackClient({
  submissionId,
  initialFeedback,
  initialTags,
}: {
  submissionId: string;
  initialFeedback: string;
  initialTags: Tag[];
}) {
  const [feedback, setFeedback] = useState<string>(initialFeedback ?? '');
  const [tags, setTags] = useState<Tag[]>(initialTags ?? []);
  const [, startTransition] = useTransition();

  return (
    <AdminFeedbackBlock
      submissionId={submissionId}
      tags={tags}
      feedback={feedback}
      mode='manage'
      onCreated={() => {}}
      onDelete={() =>
        startTransition(async () => {
          setFeedback(''); // 楽観的に空へ
          await setSubmissionTeacherFeedback(submissionId, null);
        })
      }
      onDeleteTag={(tid) =>
        startTransition(async () => {
          setTags((p) => p.filter((t) => t.id !== tid)); // 楽観削除
          await deleteFeedbackTag(tid);
        })
      }
      onAddTag={(label) =>
        startTransition(async () => {
          const temp: Tag = {
            id: `temp-${Date.now()}`,
            created_at: new Date().toISOString(),
            submission_id: submissionId,
            tag_master_id: null,
            label,
          };
          setTags((p) => [...p, temp]); // 楽観追加
          await addFeedbackTag(submissionId, label);
        })
      }
    />
  );
}
