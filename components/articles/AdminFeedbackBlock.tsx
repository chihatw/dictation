// components/articles/AdminFeedbackBlock.tsx
import { FeedbackWithTags } from '@/types/dictation';
import { TeacherFeedbackForm } from './TeacherFeedbackForm';
import { TeacherFeedbackList } from './TeacherFeedbackList';

export function AdminFeedbackBlock({
  sentenceId,
  items,
  mode = 'view',
  onDelete,
  onDeleteTag,
  onCreated,
  onAddTag,
}: {
  sentenceId: string;
  items: FeedbackWithTags[];
  mode?: 'view' | 'manage';
  onDelete?: (feedbackId: string) => void;
  onDeleteTag?: (tagId: string) => void;
  onCreated?: (created: FeedbackWithTags) => void;
  onAddTag?: (label: string, fbId: string) => void;
}) {
  const canManage = mode === 'manage';
  return (
    <div className='mt-4 space-y-3'>
      {canManage && (
        <TeacherFeedbackForm sentenceId={sentenceId} onSubmitted={onCreated} />
      )}
      <TeacherFeedbackList
        items={items}
        canManage={canManage}
        onDelete={onDelete}
        onDeleteTag={onDeleteTag}
        onAddTag={onAddTag}
      />
    </div>
  );
}
