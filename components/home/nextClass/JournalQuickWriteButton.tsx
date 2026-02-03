'use client';

import { useJournalModal } from '@/hooks/useJournalModal';
import { useEffect, useState } from 'react';

type Item = { article_id: string; full_title: string };
type Props = { item?: Item | null };

export default function JournalQuickWriteButton({ item }: Props) {
  const [localItem, setLocalItem] = useState<Item | null>(item ?? null);

  useEffect(() => {
    setLocalItem(item ?? null);
  }, [item]);

  const { openJournalModal, JournalModalElement } = useJournalModal({
    isFromHome: true,
    onSaved: (articleId: string) => {
      setLocalItem((prev) => (prev?.article_id === articleId ? null : prev));
    },
  });

  if (!localItem) return <>{JournalModalElement}</>;

  return (
    <>
      <div className='flex flex-col gap-2'>
        <div>
          <button
            type='button'
            onClick={() => openJournalModal(localItem.article_id)}
            className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors cursor-pointer'
          >
            {`去寫「${localItem.full_title}」的學習日誌`}
          </button>
        </div>
      </div>

      {JournalModalElement}
    </>
  );
}
