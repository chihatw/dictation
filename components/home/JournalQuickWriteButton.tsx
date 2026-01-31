'use client';

import { useJournalModal } from '@/hooks/useJournalModal';
import { useEffect, useState } from 'react';

type Item = { article_id: string; full_title: string };
type Props = { items: Item[] };

export default function JournalQuickWriteButton({ items }: Props) {
  const [localItems, setLocalItems] = useState<Item[]>(items);
  useEffect(() => setLocalItems(items), [items]);

  const { openJournalModal, JournalModalElement } = useJournalModal({
    isFromHome: true,
    onSaved: (articleId: string) => {
      setLocalItems((prev) => prev.filter((i) => i.article_id !== articleId));
    },
  });

  const onClick = (article_id: string) => {
    openJournalModal(article_id);
  };

  if (!localItems.length) return <>{JournalModalElement}</>;

  return (
    <>
      {!!localItems.length && (
        <div className='flex flex-col gap-2'>
          {localItems.map(
            (
              item, // ← items ではなく localItems
            ) => (
              <div key={item.article_id}>
                <button
                  type='button'
                  onClick={() => onClick(item.article_id)}
                  className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors cursor-pointer'
                >
                  {`去寫「${item.full_title}」的學習日誌`}
                </button>
              </div>
            ),
          )}
        </div>
      )}

      {JournalModalElement}
    </>
  );
}
