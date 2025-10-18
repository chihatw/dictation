'use client';

import { useJournalModal } from '@/hooks/useJournalModal'; // 上記のhookを置いている場所に合わせて
type Props = {
  articleId: string;
  label: string;
  enabled?: boolean; // falseなら何も描画しない
};

export default function JournalQuickWriteButton({
  articleId,
  label,
  enabled = true,
}: Props) {
  const { openJournalModal, JournalModalElement } = useJournalModal({
    isFromHome: true,
  });

  if (!enabled) return null;

  return (
    <>
      <button
        type='button'
        onClick={() => openJournalModal(articleId)}
        className='border rounded-full px-4 py-2 text-sm inline-flex cursor-pointer'
      >
        {label}
      </button>
      {JournalModalElement}
    </>
  );
}
