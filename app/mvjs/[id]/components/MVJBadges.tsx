import { Badge } from './Badge';

export const MVJBadges = ({
  bestId,
  hmIds,
  labelsById,
  onClearBest,
  onToggleHM,
}: {
  bestId: string | null;
  hmIds: string[];
  labelsById: Record<string, string>;
  onClearBest: () => void;
  onToggleHM: (id: string) => void;
}) => {
  return (
    <div
      className='flex flex-wrap gap-2 items-center min-h-9'
      aria-live='polite'
    >
      {bestId ? (
        <Badge
          id={bestId}
          label={labelsById[bestId] ?? '最佳作品'}
          color='gold'
          onClear={onClearBest}
        />
      ) : (
        <Placeholder text='尚未選出最佳作品' />
      )}
      {hmIds.length ? (
        hmIds.map((id) => (
          <Badge
            key={id}
            id={id}
            label={labelsById[id] ?? '佳作'}
            color='silver'
            onClear={() => onToggleHM(id)}
          />
        ))
      ) : (
        <Placeholder text='尚未選出佳作' />
      )}
    </div>
  );
};

function Placeholder({ text }: { text: string }) {
  return (
    <div className='rounded-lg border border-dashed bg-gray-50 px-2 py-1 text-xs text-gray-500 shadow-[inset_0_0_0_1px_var(--color-gray-200)] whitespace-nowrap'>
      {text}
    </div>
  );
}
