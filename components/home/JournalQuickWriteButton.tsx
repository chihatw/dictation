'use client';

import { useJournalModal } from '@/hooks/useJournalModal';
import { supabase } from '@/lib/supabase/browser';
import { useCallback, useEffect, useState } from 'react';

type Item = { article_id: string; full_title: string };
type Props = { assignment_id: string };

export default function JournalQuickWriteButton({ assignment_id }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const { openJournalModal, JournalModalElement } = useJournalModal({
    isFromHome: true,
  });

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('dictation_article_journal_status_view')
      .select('article_id, full_title')
      .eq('assignment_id', assignment_id)
      .eq('all_done', true)
      .eq('has_journal', false)
      .order('seq');

    if (error) {
      console.error(error.message);
      setItems([]);
      return;
    }
    setItems(
      (data ?? []).map((i) => ({
        article_id: i.article_id as string,
        full_title: i.full_title as string,
      }))
    );
  }, [assignment_id]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const onClick = (article_id: string) => {
    // 超楽観的: 即時に非表示
    setItems((prev) => prev.filter((i) => i.article_id !== article_id));
    // モーダルは結果を待たない
    openJournalModal(article_id);
  };

  if (!items.length) return null;

  return (
    <div className='flex flex-col gap-2 mt-4'>
      {items.map((item) => (
        <div key={item.article_id}>
          <button
            type='button'
            onClick={() => onClick(item.article_id)}
            className='border rounded-full px-4 py-2 text-sm inline-flex cursor-pointer'
          >
            {`去寫「${item.full_title}」的學習日誌`}
          </button>
        </div>
      ))}
      {JournalModalElement}
    </div>
  );
}
