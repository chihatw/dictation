import { ChatMessage } from '@/lib/chat/types';
import { sendChatMessage } from '@/utils/sendChatMessage';
import { useState } from 'react';

export function useChat(initialHistory: ChatMessage[] = []) {
  const [history, setHistory] = useState<ChatMessage[]>(initialHistory);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (newMessage: string) => {
    if (!newMessage.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage(history, newMessage);
      setHistory(response);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };
  return { history, loading, error, sendMessage, setHistory };
}
