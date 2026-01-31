'use client';

import { ClipboardCopy } from 'lucide-react';
import { useCallback, useState } from 'react';

export function PromptCopySection({ prompt }: { prompt: string }) {
  const [isCopying, setIsCopying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');

  const label = isCopying
    ? '複製中…'
    : status === 'ok'
      ? '✅ 已複製'
      : status === 'error'
        ? '複製失敗，請重試'
        : '複製範例提示詞到剪貼簿';

  const onCopy = useCallback(async () => {
    setStatus('idle');
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus('ok');
      window.setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('error');
      window.setTimeout(() => setStatus('idle'), 2500);
    } finally {
      setIsCopying(false);
    }
  }, [prompt]);

  return (
    <div className='mt-3'>
      <details className='rounded border bg-gray-50 p-2 text-xs text-gray-700 group'>
        <summary className='flex cursor-pointer list-none select-none items-center gap-2'>
          <span className='transition-transform group-open:rotate-90'>▶</span>
          <span className='font-medium'>查看範例提示詞</span>
        </summary>

        <pre className='mt-2 whitespace-pre-wrap rounded border bg-white p-3 text-sm text-gray-900'>
          {prompt}
        </pre>
      </details>

      <button
        type='button'
        onClick={onCopy}
        disabled={isCopying}
        className='mt-2 w-full rounded border px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center gap-x-1'
        aria-live='polite'
      >
        {label}
        {!isCopying && status === 'idle' && (
          <ClipboardCopy className='inline h-5 w-5 text-black/70' />
        )}
      </button>
    </div>
  );
}
