import { GoogleGenAI } from '@google/genai';
import { ChatMessage, ChatModel } from './types';

export function createGeminiChatModel(): ChatModel {
  // GoogleGenAIクライアントをAPIキーで初期化
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  return {
    async sendMessage(history: ChatMessage[]): Promise<ChatMessage> {
      const response = await ai.models.generateContent({
        contents: history.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
        model: 'gemini-2.5-flash',
      });

      if (!response.text) {
        throw new Error('No response from Gemini API');
      }

      return {
        role: 'assistant',
        content: response.text,
      };
    },
  };
}
