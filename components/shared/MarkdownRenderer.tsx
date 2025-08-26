'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// rehype-raw は XSS リスクのため未使用（HTML を無効のままにする）

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>;
}
