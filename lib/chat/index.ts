import { createGeminiChatModel } from './gemini';
import { ChatMessage, ChatModel } from './types';

export async function chat(messages: ChatMessage[]): Promise<ChatMessage> {
  const provider = process.env.CHAT_PROVIDER ?? 'gemini';

  let model: ChatModel;
  switch (provider) {
    case 'gemini':
      model = createGeminiChatModel();
      break;
    default:
      throw new Error(`Unknown chat provider: ${provider}`);
  }

  const reply = await model.sendMessage(messages);
  return reply;
}
