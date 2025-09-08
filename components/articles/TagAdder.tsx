'use client';
import { useEffect, useRef, useState } from 'react';

type Props = { onAdd: (label: string) => void };

const TagAdder = ({ onAdd }: Props) => {
  const [val, setVal] = useState('');
  const [opts, setOpts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const acRef = useRef<AbortController | null>(null);

  // 200ms デバウンスで候補取得
  useEffect(() => {
    // val 変更の200ms後に実行
    const id = setTimeout(async () => {
      const q = val.trim();
      if (!q) {
        setOpts([]);
        return;
      }
      acRef.current?.abort();
      acRef.current = new AbortController();
      try {
        const res = await fetch(`/api/tags?q=${encodeURIComponent(q)}`, {
          signal: acRef.current.signal,
          cache: 'no-store',
        });
        if (res.ok) setOpts(await res.json());
      } catch {}
    }, 200);
    return () => {
      // val 変更時にタイマーをキャンセル
      // 200ms 以内にキャンセルされれば、fetch は実行されない
      clearTimeout(id);
    };
  }, [val]);

  const submit = (label?: string) => {
    const final = (label ?? val).trim();
    if (!final) return;
    onAdd(final);
    setVal('');
    setOpts([]);
    setOpen(false);
  };

  return (
    <div className='mt-2 w-64'>
      <div className='flex gap-2'>
        <input
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setOpen(true);
          }}
          placeholder='タグを入力してEnter'
          className='w-48 rounded border px-2 py-1 text-xs'
        />
        <button
          type='button'
          onClick={() => submit()}
          className='rounded border px-2 py-1 text-xs'
        >
          追加
        </button>
      </div>

      {open && opts.length > 0 && (
        <ul className='mt-1 max-h-40 overflow-auto rounded border bg-white text-xs shadow'>
          {opts.map((t) => (
            <li
              key={t}
              className='cursor-pointer px-2 py-1 hover:bg-gray-100'
              onMouseDown={() => submit(t)} // blur前に確定
            >
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagAdder;
