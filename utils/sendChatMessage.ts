import { ChatMessage } from '@/libs/chat/types';

export async function sendChatMessage(
  history: ChatMessage[],
  newMessage: string
): Promise<ChatMessage[]> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ history, newMessage }),
  });

  if (!response.ok) {
    throw new Error('Failed to send chat message');
  }

  return response.json();
}
