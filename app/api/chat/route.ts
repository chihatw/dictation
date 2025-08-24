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
    const updatedHistory = await chat(history, newMessage);
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
