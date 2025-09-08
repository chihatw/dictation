// components/Tag.tsx
import clsx from 'clsx';

type TagProps = {
  children: React.ReactNode;
  onDelete?: () => void;
  className?: string;
};

export function Tag({ children, onDelete, className }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-xs',
        'border-red-400 bg-pink-50 text-red-600',
        className
      )}
    >
      {children}
      {onDelete && (
        <button
          type='button'
          onClick={onDelete}
          aria-label='delete tag'
          className='text-gray-500 hover:text-red-600'
        >
          ×
        </button>
      )}
    </span>
  );
}
