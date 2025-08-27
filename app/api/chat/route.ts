import { chat } from '@/lib/chat';
import { ChatMessage } from '@/lib/chat/types';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { history, newMessage } = (await req.json()) as {
    history: ChatMessage[];
    newMessage: string;
  };

  if (!newMessage) {
    return NextResponse.json({ message: 'New message is required' });
  }

  try {
    const feedback = await chat([
      ...history,
      { role: 'user', content: newMessage },
    ]);
    const updatedHistory = [
      ...history,
      { role: 'user', content: newMessage },
      feedback,
    ];
    return NextResponse.json(updatedHistory);
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
