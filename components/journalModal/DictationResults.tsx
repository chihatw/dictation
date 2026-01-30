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
    <div
      ref={listRef}
      className='mt-3 max-h-[40vh] overflow-auto rounded border p-3 text-sm'
    >
      {loading ? (
        <div className='h-5 w-1/3 animate-pulse rounded bg-gray-200' />
      ) : sortedRows.length === 0 ? (
        <p className='text-gray-500'>資料がありません。</p>
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
  );
};
