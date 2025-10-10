'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { RpcArticle } from '@/types/dictation';

export async function setSubmissionTeacherFeedback(
  submissionId: string,
  note_md: string | null
) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_submissions')
    .update({ teacher_feedback: note_md })
    .eq('id', submissionId);
  if (error) throw new Error(error.message);
}

export async function addFeedbackTag(submissionId: string, label: string) {
  const supabase = await createClientAction();
  const trimmed = label.trim();
  if (!trimmed) throw new Error('empty label');

  const { data: tagIdData, error: ge } = await supabase.rpc(
    'get_or_create_dictation_tag',
    { p_label: trimmed }
  );
  if (ge) throw new Error(ge.message);
  const tagMasterId = tagIdData as string;

  const { data, error } = await supabase
    .from('dictation_teacher_feedback_tags')
    .upsert(
      { submission_id: submissionId, tag_master_id: tagMasterId },
      { onConflict: 'submission_id,tag_master_id' }
    )
    .select(
      `
      id, created_at, submission_id, tag_master_id,
      tag:dictation_tag_master(label)
    `
    )
    .single();
  if (error) throw new Error(error.message);

  return {
    id: data.id,
    created_at: data.created_at,
    submission_id: data.submission_id,
    tag_master_id: data.tag_master_id,
    label: data.tag?.label ?? '',
  } satisfies NonNullable<
    RpcArticle['sentences'][number]['submission']
  >['tags'][number];
}

export async function deleteFeedbackTag(tagId: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_teacher_feedback_tags')
    .delete()
    .eq('id', tagId);
  if (error) throw new Error(error.message);
}
