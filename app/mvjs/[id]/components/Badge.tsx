import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

export function Badge({
  id,
  label,
  color,
  onClear,
}: {
  id: string;
  label: string;
  color: 'gold' | 'silver';
  onClear: () => void;
}) {
  const colorShadow =
    color === 'gold'
      ? 'shadow-[inset_0_0_0_2px_theme(colors.amber.500)]'
      : 'shadow-[inset_0_0_0_2px_theme(colors.zinc.500)]';
  const bgTint = color === 'gold' ? 'bg-amber-50' : 'bg-zinc-100';

  return (
    <div
      className={[
        'flex items-center gap-1 rounded-lg border px-2 py-1 text-xs whitespace-nowrap',
        bgTint,
        colorShadow,
      ].join(' ')}
    >
      <Award
        className={cn(
          color === 'gold' ? 'text-yellow-500' : 'text-gray-400',
          'h-3 w-3'
        )}
        fill='currentColor'
      />
      <span>{label}</span>
      <button
        onClick={onClear}
        aria-label={`${label}から外す`}
        className='ml-1'
      >
        ×
      </button>
    </div>
  );
}
