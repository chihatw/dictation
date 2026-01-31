import { AnswerRow } from '@/hooks/useJournalModal';
import { RefObject } from 'react';
import { MarkdownRenderer } from '../shared/MarkdownRenderer';

export const DictationResults = ({
  listRef,
  loading,
  sortedRows,
}: {
  loading: boolean;
  listRef: RefObject<HTMLDivElement | null>;
  sortedRows: AnswerRow[];
}) => {
  return (
    <details className='rounded border bg-gray-50 p-2 text-xs text-gray-700 group'>
      <summary className='flex cursor-pointer list-none select-none items-center gap-2'>
        {/* ▶︎ / ▼ */}
        <span className='transition-transform group-open:rotate-90'>▶</span>

        <span className='font-medium'>聽寫練習結果</span>
      </summary>

      <div
        ref={listRef}
        className='mt-2 max-h-[32vh] overflow-auto rounded border bg-white p-3 text-sm text-gray-900'
      >
        {loading ? (
          <div className='h-5 w-1/3 animate-pulse rounded bg-gray-200' />
        ) : sortedRows.length === 0 ? (
          <p className='text-gray-500'>沒有資料。</p>
        ) : (
          <ul className='space-y-2'>
            {sortedRows.map((r) => (
              <li key={r.seq} className='rounded border p-2 bg-gray-50'>
                <div className='font-medium'>
                  #{r.seq}　{r.content}
                </div>
                <div className='mt-1 text-gray-700 mb-2'>
                  你的回答：{r.answer}
                </div>
                <div className='rounded border p-2 bg-white'>
                  <MarkdownRenderer markdown={r.ai_feedback_md} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
};
