// app/admin/articles/JournalLockToggle.tsx
'use client';

import { cn } from '@/lib/utils';
import { Lock, Unlock } from 'lucide-react';
import { useOptimistic, useTransition } from 'react';
import { setJournalLocked } from '../actions';

type Props = {
  journalId: string | null;
  initialLocked: boolean | null;
};

export function JournalLockToggle({ journalId, initialLocked }: Props) {
  // journal がない場合は単なるダミー表示
  if (!journalId) {
    return null;
  }

  const [isPending, startTransition] = useTransition();

  const [optimisticLocked, setOptimisticLocked] = useOptimistic(
    initialLocked ?? false,
    (_current, next: boolean) => next
  );

  const handleClick = () => {
    const next = !optimisticLocked;

    // 楽観的更新 + サーバ更新をまとめて transition 内で行う
    startTransition(() => {
      // 1. 楽観的に UI を更新
      setOptimisticLocked(next);

      // 2. サーバ側を更新（await しなくてよい。エラーは catch で拾う）
      setJournalLocked(journalId, next).catch(() => {
        // エラー時にロールバックしたい場合も transition 内で
        startTransition(() => {
          setOptimisticLocked(!next);
        });
        console.error('Failed to update journal lock');
      });
    });
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={cn(
        'rounded-md border px-2 py-1 disabled:opacity-50',
        optimisticLocked && 'border-red-500 bg-red-50 border-[0.5px]'
      )}
      disabled={isPending}
      aria-pressed={optimisticLocked}
      aria-label={
        optimisticLocked ? '学習日誌のロック解除' : '学習日誌をロック'
      }
    >
      {optimisticLocked ? (
        <Lock className='h-4 w-4 text-red-500' />
      ) : (
        <Unlock className='h-4 w-4' />
      )}
    </button>
  );
}
