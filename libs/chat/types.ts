export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export interface ChatModel {
  sendMessage(history: ChatMessage[]): Promise<ChatMessage>;
}
