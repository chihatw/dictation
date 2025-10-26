'use client';
import { Badge } from './Badge';

function Placeholder({ text }: { text: string }) {
  return (
    <div
      className='
        rounded-lg border border-dashed bg-gray-50 px-2 py-1 text-xs text-gray-500
        shadow-[inset_0_0_0_1px_var(--color-gray-200)]
        whitespace-nowrap
      '
    >
      {text}
    </div>
  );
}

type Props = {
  bestId: string | null;
  hmIds: string[];
  onClearBest: () => void;
  onToggleHM: (id: string) => void;
  onSubmit: () => void;
};

export function SelectedShelf({
  bestId,
  hmIds,
  onClearBest,
  onToggleHM,
  onSubmit,
}: Props) {
  return (
    <section className='sticky top-0 z-10 mb-4 rounded-xl border bg-white/90 p-3 backdrop-blur'>
      <div className='flex items-center gap-3'>
        <div className='flex-1 overflow-hidden'>
          <div
            className='flex gap-2 overflow-x-auto items-center min-h-9 pr-1'
            aria-live='polite'
          >
            {bestId ? (
              <Badge
                id={bestId}
                label='最佳作品'
                color='gold'
                onClear={onClearBest}
              />
            ) : (
              <Placeholder text='尚未選擇最佳作品' />
            )}
            {hmIds.length ? (
              hmIds.map((id) => (
                <Badge
                  key={id}
                  id={id}
                  label='佳作'
                  color='silver'
                  onClear={() => onToggleHM(id)}
                />
              ))
            ) : (
              <Placeholder text='尚未選擇佳作' />
            )}
          </div>
        </div>
        <button
          className='shrink-0 rounded-lg bg-black px-3 py-2 text-white'
          onClick={onSubmit}
        >
          確認選擇
        </button>
      </div>
    </section>
  );
}
