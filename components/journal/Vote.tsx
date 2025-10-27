// app/journals/Vote.tsx
'use client';

import { voteAction } from '@/app/actions/vote';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useActionState, useEffect, useMemo, useRef, useState } from 'react';

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function Vote({
  id,
  initialScore,
  createdAt,
  onOptimistic,
  onSettled,
}: {
  id: string;
  initialScore: number;
  createdAt: string;
  onOptimistic?: (score: number) => void;
  onSettled?: (score: number) => void;
}) {
  const [state, formAction, isPending] = useActionState(voteAction, {
    score: initialScore,
    error: null as string | null,
  });

  const unlockAt = useMemo(
    () => new Date(new Date(createdAt).getTime() + 24 * 60 * 60 * 1000),
    [createdAt]
  );

  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000); // 30秒ごとに更新
    return () => clearInterval(t);
  }, []);

  const msLeft = unlockAt.getTime() - now.getTime();
  const canVote = msLeft <= 0;

  // アクション確定後に親へ“確定値”を通知して差分修正
  const prevScoreRef = useRef(state.score);
  useEffect(() => {
    if (state.score !== prevScoreRef.current) {
      prevScoreRef.current = state.score;
      onSettled?.(state.score);
    }
  }, [state.score, onSettled]);

  // サーバー側ガードに引っかかった場合のフォールバック
  const blocked = state.error === 'not_yet';

  if (!canVote || blocked) {
    const left = Math.max(msLeft, 0);
    const hh = Math.floor(left / 3_600_000);
    const mm = Math.floor((left % 3_600_000) / 60_000);
    return (
      <div className='mt-2 text-right text-xs text-slate-500'>
        再過 {pad(hh)}:{pad(mm)} 才能評分
      </div>
    );
  }

  const submit =
    (delta: 1 | -1) => (e: React.MouseEvent<HTMLButtonElement>) => {
      // 楽観的反映
      onOptimistic?.(state.score + delta);
      // そのままサーバー送信
      // formAction は <button formAction> 経由で呼ぶのでここでは何もしない
    };

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
          onClick={submit(1)}
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
          onClick={submit(-1)}
          disabled={isPending}
          className='rounded-full px-2 py-1 text-xs bg-slate-900 hover:bg-slate-700 disabled:opacity-50'
        >
          <span className='inline-flex items-center gap-1 text-white font-bold'>
            <ThumbsDown className='h-3 w-3' /> Bad
          </span>
        </button>
      </form>

      {state.error === 'rate_limited' && (
        <div className='text-xs text-orange-600 ml-2'>請稍候再試。</div>
      )}
      {state.error === 'unauthorized' && (
        <div className='text-xs text-red-600 ml-2'>需要重新登入。</div>
      )}
      {state.error === 'rpc_error' && (
        <div className='text-xs text-red-600 ml-2'>發生錯誤。</div>
      )}
    </div>
  );
}
