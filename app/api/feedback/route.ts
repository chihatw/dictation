export const runtime = 'nodejs'; // Edge ではなく Node で実行

import { chat } from '@/lib/chat';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // ルートハンドラ用の Supabase クライアント（クッキーアダプタ必須）
  const supabase = await createClient();

  try {
    // 認証ユーザーを取得
    const { data: userRes } = await supabase.auth.getUser();
    const userId = userRes.user!.id;

    const { sentenceId, sentenceScript, userAnswer } = (await req.json()) as {
      sentenceId: string;
      sentenceScript: string;
      userAnswer: string;
    };

    if (!sentenceScript || !userAnswer) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    // 一往復のみのプロンプト（system → user）

    const userPrompt =
      '你是一位日語老師。台灣的中學生正嘗試聽寫（日文音聲）。' +
      '請以簡潔溫柔的繁體中文回覆，不加問候語，也不重複學生答案或完整音聲原文。' +
      '正誤指摘僅限「聽對的詞語確認」與「聽錯的詞語訂正」，不要指出漏聽的詞語。' +
      '若表記不同但發音相同，也算正確，例如：音聲原文「灯りが見えた」、學生答案「明かりがみえた」。' +
      '回答中若出現日文漢字，務必加上假名（如：朝（あさ）、大雨（おおあめ））。' +
      '請加入鼓勵或稱讚，讓學生有動力繼續學習，並使用 Markdown 強調與 emoji，保持簡短（最多 5 行）。' +
      `音聲原文（參考）：${sentenceScript}\n\n` +
      `學生的聽寫答案：${userAnswer}\n` +
      '請產生符合上述規則的回饋。';

    const updatedHistory = await chat([], userPrompt);

    const feedbackMarkdown = updatedHistory.at(-1)?.content ?? '';

    await supabase
      .from('dictation_submissions')
      .upsert(
        {
          user_id: userId,
          sentence_id: sentenceId,
          answer: userAnswer,
          feedback_md: feedbackMarkdown,
        },
        { onConflict: 'user_id,sentence_id' } // ← 1:1を担保
      )
      .select()
      .single();

    return NextResponse.json({ feedbackMarkdown });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
