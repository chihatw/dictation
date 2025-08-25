import { chat } from '@/lib/chat';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sentenceScript, userAnswer } = (await req.json()) as {
      sentenceScript: string;
      userAnswer: string;
    };

    if (!sentenceScript || !userAnswer) {
      return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    // 一往復のみのプロンプト（system → user）

    const userPrompt =
      '你是一位日語老師。台灣的中學生正嘗試聽寫（日文音聲）。請用「簡潔且溫柔的繁體中文」回覆。' +
      '不要加入問候語。' +
      '正誤指摘時：請僅做「聽對的詞語確認」與「聽錯的詞語訂正」，不要指出漏聽的詞語。' +
      '如果回答中出現日文漢字，請務必加上假名（例如：朝（あさ）、大雨（おおあめ））。' +
      '不需要復誦學生的答案。' +
      '不需要提供具體建議，但請加入鼓勵或稱讚的話語，讓學生有動力繼續學習。' +
      '不要在回答中列出完整的正解スクリプト（因為會在別的地方顯示）。' +
      '回答時請使用 Markdown 強調與 emoji，保持簡短（最多 5 行）。' +
      `正解スクリプト（參考）：${sentenceScript}\n\n` +
      `學生的聽寫答案：${userAnswer}\n` +
      '請產生符合上述規則的回饋。';

    const updatedHistory = await chat([], userPrompt);

    const feedbackMarkdown = updatedHistory.at(-1)?.content ?? '';

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
