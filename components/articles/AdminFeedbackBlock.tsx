import { useState } from 'react';
import { TeacherFeedbackForm } from './TeacherFeedbackForm';
import { TeacherFeedbackList } from './TeacherFeedbackList';

// isAdmin が true のときだけフォームも表示
export function AdminFeedbackBlock({
  sentenceId,
  isAdmin,
}: {
  sentenceId: string;
  isAdmin: boolean;
}) {
  const [refreshToken, setRefreshToken] = useState(0);
  const bump = () => setRefreshToken((n) => n + 1);

  return (
    <div className='mt-4 space-y-3'>
      {isAdmin && (
        <TeacherFeedbackForm sentenceId={sentenceId} onSubmitted={bump} />
      )}
      <TeacherFeedbackList
        sentenceId={sentenceId}
        isAdmin={isAdmin} // 非管理者には false を渡す
        refreshToken={refreshToken}
      />
    </div>
  );
}
