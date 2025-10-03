'use client';

import { AdminFeedbackBlock } from '@/components/articles/AdminFeedbackBlock';
import { HeaderRow } from '@/components/sentence/parts/HeaderRow';
import { toPublicUrl } from '@/lib/tts/publicUrl';
import { FeedbackWithTags } from '@/types/dictation';
import { useState } from 'react';
import { addFeedbackTag, deleteFeedback, deleteFeedbackTag } from './actions';
import { SentenceAdminData } from './types';

export default function SentenceAdminPanel({
  sentence,
}: {
  sentence: SentenceAdminData;
}) {
  const [items, setItems] = useState<FeedbackWithTags[]>(
    sentence.teacher_feedback ?? []
  );
  const audioUrl = sentence.audio_path
    ? toPublicUrl(sentence.audio_path)
    : undefined;

  return (
    <section className='rounded-xl border bg-white p-4 shadow-sm'>
      <HeaderRow
        id={`sentence-${sentence.id}`}
        seq={sentence.seq}
        audioUrl={audioUrl}
      />
      <div className='mt-3 text-sm text-slate-600'>
        <span className='font-medium'>原文：</span>
        {sentence.content}
      </div>

      <AdminFeedbackBlock
        sentenceId={sentence.id}
        items={items}
        // 管理ページでは編集可能
        mode='manage'
        onCreated={(created) => setItems((p) => [...p, created])}
        onDelete={async (fid) => {
          setItems((p) => p.filter((x) => x.id !== fid));
          await deleteFeedback(fid);
        }}
        onDeleteTag={async (tid) => {
          setItems((p) =>
            p.map((f) => ({ ...f, tags: f.tags.filter((t) => t.id !== tid) }))
          );
          await deleteFeedbackTag(tid);
        }}
        onAddTag={async (label, fid) => {
          await addFeedbackTag(fid, label);
          // 再取得せず楽観維持。実ID反映は不要なら省略
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
        }}
      />
    </section>
  );
}
