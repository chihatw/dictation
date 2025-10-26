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
        'flex items-center gap-2 rounded-lg border px-2 py-1 text-xs whitespace-nowrap',
        bgTint,
        colorShadow,
      ].join(' ')}
    >
      <span>{label}</span>
      <span className='text-gray-600'>#{id}</span>
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
