'use client';
import { ClozeObj } from '@/types/dictation';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';

type Props = {
  objs: ClozeObj[];
};

const ClozeRow = ({ objs }: Props) => {
  const blankCount = objs.filter((pt) => pt.t !== 'text').length;
  const [visibleList, setVisibleList] = useState<boolean[]>(
    Array(blankCount).fill(false)
  );

  const allVisible = visibleList.every(Boolean);
  const someHidden = visibleList.some((v) => !v);
  const toggleAll = () => setVisibleList(Array(blankCount).fill(someHidden));

  let bi = -1; // 空所カウンタ

  return (
    <div className='grid grid-cols-[1fr_auto] gap-1'>
      <p>
        {objs.map((obj, i) => {
          if (obj.t === 'text') return <span key={i}>{obj.v}</span>;
          const bIndex = ++bi;
          return (
            <Blank
              key={i}
              v={obj.v}
              visible={visibleList[bIndex]}
              onToggle={() =>
                setVisibleList((prev) =>
                  prev.map((v, j) => (j === bIndex ? !v : v))
                )
              }
            />
          );
        })}
      </p>
      {!(objs.length === 1 && objs[0].t === 'text') && (
        <button
          onClick={toggleAll}
          className='align-baseline px-2 py-0.5 cursor-pointer hover:bg-gray-100 rounded-sm'
          aria-label={allVisible ? 'hide all' : 'show all'}
        >
          {allVisible ? (
            <Eye className='text-gray-500 w-5 h-5' />
          ) : (
            <EyeClosed className='text-gray-500 w-5 h-5' />
          )}
        </button>
      )}
    </div>
  );
};

export default ClozeRow;
function Blank({
  v,
  visible,
  onToggle,
}: {
  v: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className='mx-1 inline-block rounded-sm border px-2 py-0.5 align-baseline transition hover:bg-gray-100 focus:outline-none cursor-pointer'
      aria-pressed={visible}
    >
      {visible ? (
        <span>{v}</span>
      ) : (
        <span className='inline-block select-none text-transparent'>{v}</span>
      )}
    </button>
  );
}
