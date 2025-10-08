'use client';

import { useState } from 'react';

function ArticlePanel({
  title,
  items,
}: {
  title: string;
  items: {
    parts: { t: 'text' | 'blank'; v: string }[];
  }[];
}) {
  return (
    <section className='w-full rounded-2xl border bg-white p-6 shadow-sm'>
      <header className='mb-4 flex items-center justify-between'>
        <h2 className='text-2xl font-bold'>{title}</h2>
      </header>

      <div>
        {items.map((it, idx) => (
          <div key={idx} className='mb-4'>
            <ClozeRow parts={it.parts} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ArticlePanel;

function Blank({ v, hidden }: { v: string; hidden: boolean }) {
  const [visible, setVisible] = useState(!hidden);
  return (
    <button
      onClick={() => setVisible((x) => !x)}
      className='mx-1 inline-block rounded-xl border px-2 py-0.5 align-baseline text-[1.8rem] leading-[1.8] transition hover:bg-gray-100 focus:outline-none'
      aria-pressed={visible}
    >
      {visible ? (
        <span className='underline decoration-dotted'>{v}</span>
      ) : (
        <span className='inline-block min-w-28 select-none text-transparent'>
          {v}
        </span>
      )}
    </button>
  );
}

function ClozeRow({
  parts,
}: {
  parts: { t: 'text' | 'blank'; v: string; hint?: string }[];
}) {
  const [hideAll] = useState(true);
  return (
    <div className='mb-3'>
      <p className='text-[2.2rem] leading-[1.7]'>
        {parts.map((p, i) =>
          p.t === 'text' ? (
            <span key={i}>{p.v}</span>
          ) : (
            <Blank key={i} v={p.v} hidden={hideAll} />
          )
        )}
      </p>
    </div>
  );
}
