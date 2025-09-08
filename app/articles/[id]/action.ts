'use server';

import { chat } from '@/lib/chat';
import { createClientAction } from '@/lib/supabase/server-action';
import { z } from 'zod';

type CreateFeedbackResult =
  | { ok: false; error: string }
  | { ok: true; feedbackMarkdown: string };

export type Tag = {
  id: string;
  created_at: string;
  user_id: string;
  label: string;
  teacher_feedback_id: string;
};

export type FeedbackWithTags = {
  id: string;
  created_at: string;
  sentence_id: string;
  note_md: string;
  tags: Tag[];
};

/** クライアントから渡る入力の検証スキーマ */
const schema = z.object({
  sentenceId: z.string().uuid(),
  sentenceScript: z.string().min(1),
  userAnswer: z.string().min(1),
});

/**
 * 学習者向けのAIフィードバックを生成し、dictation_submissions に保存する
 * - 入力を検証
 * - 未認証ならエラー
 * - AIにMarkdownでの短いFBを生成させ、upsertで保存（user_id + sentence_id の複合一意）
 */
export async function createFeedbackAction(
  input: unknown
): Promise<CreateFeedbackResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: '入力が不正です。' };
  const { sentenceId, sentenceScript, userAnswer } = parsed.data;

  const supabase = await createClientAction();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return { ok: false, error: '未認証です。' };

  // プロンプト方針：簡潔・繁体字・Markdown・5行以内
  const userPrompt =
    '你是一位日語老師。台灣的中學生正嘗試聽寫（日文音聲）。' +
    '請以簡潔溫柔的繁體中文回覆，不加問候語，也不重複學生答案或完整音聲原文。' +
    '正誤指摘僅限「聽對的詞語確認」與「聽錯的詞語訂正」，不要指出漏聽的詞語。' +
    '若表記不同但發音相同，也算正確。' +
    '回答中若出現日文漢字，務必加上假名。' +
    '使用 Markdown 與 emoji，最多 5 行。' +
    `音聲原文：${sentenceScript}\n學生答案：${userAnswer}\n`;

  const feedback = await chat([{ role: 'user', content: userPrompt }]);
  const feedbackMarkdown = feedback.content ?? '';

  const { error } = await supabase.from('dictation_submissions').upsert(
    {
      user_id: userId,
      sentence_id: sentenceId,
      answer: userAnswer,
      feedback_md: feedbackMarkdown,
    },
    { onConflict: 'user_id,sentence_id' }
  );

  if (error) return { ok: false, error: '保存に失敗しました。' };
  return { ok: true, feedbackMarkdown };
}

/**
 * 教員用フィードバックを1件作成し、作成直後のタグ付きレコードを返す
 * - 返値には関連タグ配列を含める（空配列になり得る）
 */
export async function addFeedbackWithTags(
  sentenceId: string,
  noteMd: string
): Promise<FeedbackWithTags> {
  const supabase = await createClientAction();
  const { data, error } = await supabase
    .from('dictation_teacher_feedback')
    .insert({ sentence_id: sentenceId, note_md: noteMd })
    .select(
      `
      id, created_at, sentence_id, note_md,
      tags:dictation_teacher_feedback_tags (id, created_at, user_id, label, teacher_feedback_id)
    `
    )
    .single();
  if (error) throw new Error(error.message);
  return data as FeedbackWithTags;
}

/**
 * 教員用フィードバックを1件削除
 * - 関連タグはDBの外部キー（ON DELETE CASCADE）で自動削除
 */
export async function deleteFeedback(id: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_teacher_feedback')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * 文ID配列に紐づく教員用フィードバック＋タグを一括取得
 * - 初期表示でのN+1回避
 * - フィードバックは新しい順、タグは作成順
 * - 返値は sentence_id をキーにしたマップ
 */
export async function listFeedbackWithTagsBulkBySentence(
  sentenceIds: string[]
): Promise<Record<string, FeedbackWithTags[]>> {
  if (!sentenceIds?.length) return {};
  const supabase = await createClientAction();

  const { data, error } = await supabase
    .from('dictation_teacher_feedback')
    .select(
      `
      id, created_at, sentence_id, note_md,
      tags:dictation_teacher_feedback_tags (
        id, created_at, user_id, label, teacher_feedback_id
      )
    `
    )
    .in('sentence_id', sentenceIds)
    .order('created_at', { ascending: true }) // フィードバック：旧→新
    .order('created_at', {
      referencedTable: 'dictation_teacher_feedback_tags',
      ascending: true,
    }); // タグ：旧→新

  if (error) throw new Error(error.message);

  const map: Record<string, FeedbackWithTags[]> = {};
  for (const row of (data ?? []) as FeedbackWithTags[]) {
    (map[row.sentence_id] ||= []).push(row);
  }
  return map;
}

/**
 * タグを1件追加
 * - 実行ユーザーIDを埋める（誰が付けたか追跡可能）
 * - 返値は作成済みタグ1件
 */
export async function addFeedbackTag(
  teacherFeedbackId: string,
  label: string,
  ownerUserId: string
) {
  const supabase = await createClientAction();

  const trimmed = label.trim();
  if (!trimmed) throw new Error('empty label');

  const { data, error } = await supabase
    .from('dictation_teacher_feedback_tags')
    .insert({
      teacher_feedback_id: teacherFeedbackId,
      user_id: ownerUserId,
      label: trimmed,
    })
    .select('id, created_at, teacher_feedback_id, user_id, label')
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * タグを1件削除
 * - RLSで管理者のみ許可することを想定
 */
export async function deleteFeedbackTag(tagId: string) {
  const supabase = await createClientAction();
  const { error } = await supabase
    .from('dictation_teacher_feedback_tags')
    .delete()
    .eq('id', tagId);
  if (error) throw new Error(error.message);
}
