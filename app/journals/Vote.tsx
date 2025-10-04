// app/journals/Vote.tsx
'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useActionState } from 'react';
import { voteAction } from './actions';

export function Vote({
  id,
  initialScore,
}: {
  id: string;
  initialScore: number;
}) {
  const [state, formAction, isPending] = useActionState(voteAction, {
    score: initialScore,
    error: null as string | null,
  });

  return (
    <div className='mt-2 flex gap-x-2 items-center justify-end'>
      <div className='text-slate-900 font-bold w-16 whitespace-nowrap'>
        評分: {state.score}
      </div>

      <form>
        <input type='hidden' name='id' value={id} />
        <input type='hidden' name='current' value={state.score} />
        <input type='hidden' name='delta' value='1' />
        <button
          formAction={formAction}
          disabled={isPending}
          className='rounded-full px-2 py-1 text-xs bg-slate-900 hover:bg-slate-700 disabled:opacity-50'
        >
          <span className='inline-flex items-center gap-1 text-white font-bold'>
            <ThumbsUp className='h-3 w-3' /> Good
          </span>
        </button>
      </form>

      <form>
        <input type='hidden' name='id' value={id} />
        <input type='hidden' name='current' value={state.score} />
        <input type='hidden' name='delta' value='-1' />
        <button
          formAction={formAction}
          disabled={isPending}
          className='rounded-full px-2 py-1 text-xs bg-slate-900 hover:bg-slate-700 disabled:opacity-50'
        >
          <span className='inline-flex items-center gap-1 text-white font-bold'>
            <ThumbsDown className='h-3 w-3' /> Bad
          </span>
        </button>
      </form>

      {state.error === 'rate_limited' && (
        <div className='text-xs text-orange-600 ml-2'>
          リクエストが多すぎます。少し待って再試行。
        </div>
      )}
      {state.error === 'unauthorized' && (
        <div className='text-xs text-red-600 ml-2'>再ログインが必要です。</div>
      )}
    </div>
  );
}
