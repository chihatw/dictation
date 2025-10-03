'use server';
// app/articles/[id]/action.ts

import { chat } from '@/lib/chat';
import { createClientAction } from '@/lib/supabase/server-action';
import { FeedbackWithTags } from '@/types/dictation';
import { z } from 'zod';

type CreateRes = {
  saved: boolean;
  logged: boolean;
  completed: boolean;
  article_id: string;
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
