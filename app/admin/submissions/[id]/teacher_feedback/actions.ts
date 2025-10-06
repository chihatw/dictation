'use server';

import { createClientAction } from '@/lib/supabase/server-action';
import { FeedbackWithTags, Tag } from '@/types/dictation';

export async function addFeedbackWithTags(
  submissionId: string,
  note_md: string
): Promise<FeedbackWithTags> {
  const supabase = await createClientAction();
  const { data, error } = await supabase
    .from('dictation_teacher_feedback')
    .insert({ submission_id: submissionId, note_md })
    .select(`id, created_at, submission_id, note_md`)
    .single();
  if (error) throw new Error(error.message);
  return {
    id: data.id,
    created_at: data.created_at,
    submission_id: data.submission_id,
    note_md: data.note_md,
    tags: [],
  };
}

export async function deleteFeedback(feedbackId: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_teacher_feedback')
    .delete()
    .eq('id', feedbackId);
  if (error) throw new Error(error.message);
}

export async function addFeedbackTag(teacherFeedbackId: string, label: string) {
  const supabase = await createClientAction();
  const trimmed = label.trim();
  if (!trimmed) throw new Error('empty label');

  // 1) マスタIDを取得 or 作成
  const { data: tagIdData, error: ge } = await supabase.rpc(
    'get_or_create_dictation_tag',
    { p_label: trimmed }
  );
  if (ge) throw new Error(ge.message);
  const tagMasterId = tagIdData as string;

  // 2) 紐付けを作成（重複は無視）
  const { data, error } = await supabase
    .from('dictation_teacher_feedback_tags')
    .upsert(
      { teacher_feedback_id: teacherFeedbackId, tag_master_id: tagMasterId },
      { onConflict: 'teacher_feedback_id,tag_master_id' }
    )
    .select(
      `
      id, created_at, teacher_feedback_id, tag_master_id,
      tag:dictation_tag_master(label)
    `
    )
    .single();
  if (error) throw new Error(error.message);

  return {
    id: data.id,
    created_at: data.created_at,
    teacher_feedback_id: data.teacher_feedback_id,
    tag_master_id: data.tag_master_id,
    label: data.tag?.label ?? '',
  } satisfies Tag;
}

export async function deleteFeedbackTag(tagId: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_teacher_feedback_tags')
    .delete()
    .eq('id', tagId);
  if (error) throw new Error(error.message);
}
