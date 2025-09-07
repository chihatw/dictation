import { FeedbackWithTags } from '@/app/articles/[id]/action';
import { TeacherFeedbackForm } from './TeacherFeedbackForm';
import { TeacherFeedbackList } from './TeacherFeedbackList';

export function AdminFeedbackBlock({
  sentenceId,
  isAdmin,
  items,
  onDelete,
  onDeleteTag,
  onCreated,
  onAddTag,
}: {
  sentenceId: string;
  isAdmin: boolean;
  items: FeedbackWithTags[];
  onDelete?: (feedbackId: string) => void;
  onDeleteTag?: (tagId: string) => void;
  onCreated?: (created: FeedbackWithTags) => void;
  onAddTag?: (label: string, feedbackId: string) => void;
}) {
  return (
    <div className='mt-4 space-y-3'>
      {isAdmin && (
        <TeacherFeedbackForm
          sentenceId={sentenceId}
          onSubmitted={onCreated} // フォーム完了→親へ通知
        />
      )}
      <TeacherFeedbackList
        items={items}
        isAdmin={isAdmin}
        onDelete={onDelete}
        onDeleteTag={onDeleteTag}
        onAddTag={onAddTag}
      />
    </div>
  );
}
