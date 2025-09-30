'use server';

import { chat } from '@/lib/chat';
import { createClientAction } from '@/lib/supabase/server-action';
import { z } from 'zod';

export type Tag = {
  id: string;
  created_at: string;
  teacher_feedback_id: string;
  tag_master_id: string | null;
  label: string;
};

export type FeedbackWithTags = {
  id: string;
  created_at: string;
  sentence_id: string;
  note_md: string;
  tags: Tag[];
};

type CreateRes = {
  saved: boolean;
  logged: boolean;
  completed: boolean;
  article_id: string;
};

// RPC戻り値型（DB → TS）
type RpcFeedbackRow = Omit<FeedbackWithTags, 'tags'> & {
  tags: unknown; // JSONB はまず unknown で受ける
};

/** クライアントから渡る入力の検証スキーマ */
const schema = z.object({
  sentenceId: z.string().uuid(),
  sentenceScript: z.string().min(1),
  userAnswer: z.string().min(1),
  metrics: z.object({
    playsCount: z.number().int().nonnegative(),
    listenedFullCount: z.number().int().nonnegative(),
    elapsedMsSinceItemView: z.number().int().nonnegative(),
    elapsedMsSinceFirstPlay: z.number().int().nonnegative(),
  }),
  selfAssessedComprehension: z.number().int().min(1).max(4), // 1=低, 4=高+運用可
});

export type CreateFeedbackAndLogArgs = z.infer<typeof schema>;

export async function createFeedbackAndLogAction(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false as const, error: '入力が不正です。' };

  const {
    sentenceId,
    sentenceScript,
    userAnswer,
    metrics,
    selfAssessedComprehension,
  } = parsed.data;

  const supabase = await createClientAction();
  const { data: _data } = await supabase.auth.getUser();
  if (!_data.user?.id) return { ok: false as const, error: '未認証です。' };

  // フィードバック生成（失敗時はフォールバック文言）
  let feedbackMarkdown = '';
  try {
    const prompt =
      '你是一位日語老師。台灣的中學生正嘗試聽寫（日文音聲）。' +
      '請以簡潔溫柔的繁體中文回覆，不加問候語，也不重複學生答案或完整音聲原文。' +
      '正誤指摘僅限「聽對的詞語確認」與「聽錯的詞語訂正」，不要指出漏聽的詞語。' +
      '若表記不同但發音相同，也算正確。' +
      '回答中若出現日文漢字，務必加上假名。' +
      '使用 Markdown 與 emoji，最多 5 行。' +
      `音聲原文：${sentenceScript}\n學生答案：${userAnswer}\n`;
    const ai = await chat([{ role: 'user', content: prompt }]);
    feedbackMarkdown = ai.content ?? '';
  } catch {
    feedbackMarkdown = '（系統忙碌，稍後自動補上老師回饋）';
  }

  // DB内Txで 保存 + ログ
  const { data, error } = await supabase
    .rpc('create_feedback_and_log', {
      p_sentence_id: sentenceId,
      p_answer: userAnswer,
      p_feedback_md: feedbackMarkdown,
      p_plays_count: metrics.playsCount,
      p_elapsed_ms_since_item_view: metrics.elapsedMsSinceItemView,
      p_elapsed_ms_since_first_play: metrics.elapsedMsSinceFirstPlay,
      p_self_comp: selfAssessedComprehension,
    })
    .single<CreateRes>();

  if (error) return { ok: false as const, error: '保存に失敗しました。' };
  return {
    ok: true as const,
    feedbackMarkdown,
    completed: data.completed,
    articleId: data.article_id,
  };
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
    .select(`id, created_at, sentence_id, note_md`)
    .single();
  if (error) throw new Error(error.message);

  return {
    id: data.id,
    created_at: data.created_at,
    sentence_id: data.sentence_id,
    note_md: data.note_md,
    tags: [],
  };
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
 * - 返値は sentence_id をキーにしたマップ
 */
export async function listFeedbackWithTagsBulkBySentence(
  sentenceIds: string[]
): Promise<Record<string, FeedbackWithTags[]>> {
  if (!sentenceIds?.length) return {};
  const supabase = await createClientAction();

  const { data, error } = await supabase.rpc('get_feedbacks_with_tags', {
    p_sentence_ids: sentenceIds,
  });

  if (error) throw new Error(error.message);

  // JSONB → 型へ
  const rows = (data ?? []) as RpcFeedbackRow[];

  const map: Record<string, FeedbackWithTags[]> = {};
  for (const r of rows) {
    // パース処理（安全に Tag[] へ変換）
    const tags: Tag[] = Array.isArray(r.tags) ? (r.tags as Tag[]) : [];

    const f: FeedbackWithTags = {
      ...r,
      tags,
    };
    (map[f.sentence_id] ||= []).push(f);
  }
  return map;
}

/**
 * タグを1件追加
 * - 返値は作成済みタグ1件
 */
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
    .insert({
      teacher_feedback_id: teacherFeedbackId,
      tag_master_id: tagMasterId,
    })
    .select(
      `
      id, created_at, teacher_feedback_id, tag_master_id,
      tag:dictation_tag_master(label)
    `
    )
    .single();
  if (error) throw new Error(error.message);

  // 平坦化して返す
  return {
    id: data.id,
    created_at: data.created_at,
    teacher_feedback_id: data.teacher_feedback_id,
    tag_master_id: data.tag_master_id,
    label: data.tag?.label ?? '',
  } as Tag;
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
