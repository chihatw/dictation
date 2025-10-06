// components/articles/AdminFeedbackClient.tsx
'use client';

import type { FeedbackWithTags } from '@/types/dictation';
import { useState, useTransition } from 'react';
import { AdminFeedbackBlock } from './AdminFeedbackBlock';

// サーバーアクションを直接 import
import {
  addFeedbackTag,
  deleteFeedback,
  deleteFeedbackTag,
} from '@/app/admin/submissions/[id]/teacher_feedback/actions';

export function AdminFeedbackClient({
  submissionId,
  initialItems,
}: {
  submissionId: string;
  initialItems: FeedbackWithTags[];
}) {
  const [items, setItems] = useState<FeedbackWithTags[]>(initialItems);
  const [isPending, startTransition] = useTransition();

  return (
    <AdminFeedbackBlock
      submissionId={submissionId}
      items={items}
      mode='manage'
      onCreated={(created) => setItems((p) => [...p, created])}
      onDelete={(fid) =>
        startTransition(async () => {
          setItems((p) => p.filter((x) => x.id !== fid)); // 楽観
          await deleteFeedback(fid);
        })
      }
      onDeleteTag={(tid) =>
        startTransition(async () => {
          setItems((p) =>
            p.map((f) => ({ ...f, tags: f.tags.filter((t) => t.id !== tid) }))
          );
          await deleteFeedbackTag(tid);
        })
      }
      onAddTag={(label, fid) =>
        startTransition(async () => {
          // 楽観追加（temp-id）
          setItems((p) =>
            p.map((f) =>
              f.id === fid
                ? {
                    ...f,
                    tags: [
                      ...f.tags,
                      {
                        id: `temp-${Date.now()}`,
                        created_at: new Date().toISOString(),
                        teacher_feedback_id: fid,
                        tag_master_id: null,
                        label,
                      },
                    ],
                  }
                : f
            )
          );
          await addFeedbackTag(fid, label); // 引数順に注意
        })
      }
    />
  );
}
