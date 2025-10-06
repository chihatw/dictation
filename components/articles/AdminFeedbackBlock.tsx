// components/articles/AdminFeedbackBlock.tsx
import { Tag } from '@/types/dictation';
import { TeacherFeedbackForm } from './TeacherFeedbackForm';
import { TeacherFeedbackList } from './TeacherFeedbackList';

export function AdminFeedbackBlock({
  submissionId,
  tags,
  feedback,
  mode = 'view',
  onDelete, // ← 引数なし
  onDeleteTag,
  onCreated,
  onAddTag,
}: {
  submissionId?: string;
  tags: Tag[];
  feedback: string | null;
  mode?: 'view' | 'manage';
  onDelete?: () => void; // ← ここを修正 (引数なし)
  onDeleteTag?: (tagId: string) => void;
  onCreated?: () => void;
  onAddTag?: (label: string) => void; // ← 既に修正済み想定
}) {
  const canManage = mode === 'manage' && !!submissionId;

  return (
    <div className='mt-4 space-y-3'>
      {canManage && (
        <TeacherFeedbackForm
          submissionId={submissionId}
          onSubmitted={onCreated}
        />
      )}

      {/* 短評の削除はここで扱う（Listへは渡さない） */}
      {canManage && !!feedback && (
        <div className='flex justify-end'>
          <button
            type='button'
            onClick={() => onDelete?.()}
            className='h-7 whitespace-nowrap rounded border px-3 text-xs text-red-600'
          >
            短評を削除
          </button>
        </div>
      )}

      <TeacherFeedbackList
        tags={tags}
        feedback={feedback}
        canManage={canManage}
        onDeleteTag={onDeleteTag}
        onAddTag={onAddTag}
      />
    </div>
  );
}
