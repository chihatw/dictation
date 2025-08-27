'use server';

import { chat } from '@/lib/chat';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

type CreateFeedbackResult =
  | { ok: false; error: string }
  | { ok: true; feedbackMarkdown: string };

const schema = z.object({
  sentenceId: z.string().uuid(),
  sentenceScript: z.string().min(1),
  userAnswer: z.string().min(1),
});

export async function createFeedbackAction(
  input: unknown
): Promise<CreateFeedbackResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: '入力が不正です。' };
  const { sentenceId, sentenceScript, userAnswer } = parsed.data;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return { ok: false, error: '未認証です。' };

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
