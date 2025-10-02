// app/admin/articles/_components/EditSubtitleForm.tsx
'use client';

import { useState } from 'react';
import { updateSubtitle } from '../actions';

export function EditSubtitleForm({
  id,
  defaultSubtitle,
}: {
  id: string;
  defaultSubtitle: string;
}) {
  const [subtitle, setSubtitle] = useState(defaultSubtitle);
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <form
      action={async (fd) => {
        setPending(true);
        setErr(null);
        setOk(null);
        fd.set('id', id);
        const res = await updateSubtitle(fd);
        if (!res.ok) setErr(res.error ?? '更新に失敗しました');
        else setOk('更新しました');
        setPending(false);
      }}
      className='space-y-4'
    >
      <div className='space-y-1'>
        <label className='text-sm font-medium'>subtitle</label>
        <input
          name='subtitle'
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className='w-full rounded-md border px-3 py-2 text-sm'
          required
        />
      </div>
      <button
        type='submit'
        disabled={pending}
        className='rounded-md bg-black px-4 py-2 text-white disabled:opacity-50'
      >
        {pending ? '更新中…' : '更新する'}
      </button>
      {err && <p className='text-sm text-red-600'>エラー: {err}</p>}
      {ok && <p className='text-sm text-green-700'>{ok}</p>}
    </form>
  );
}
