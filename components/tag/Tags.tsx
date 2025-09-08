// components/Tags.tsx
import clsx from 'clsx';
import { Tag } from './Tag';

type TagItem = string | { id: string; label: string };

type TagsProps = {
  items: TagItem[];
  isAdmin?: boolean;
  onDeleteTag?: (id: string) => void; // string項目にはdeleteを出さない
  className?: string;
};

export function Tags({ items, isAdmin, onDeleteTag, className }: TagsProps) {
  return (
    <div className={clsx('mt-2 flex flex-wrap gap-1', className)}>
      {items.map((it) => {
        const key = typeof it === 'string' ? it : it.id;
        const label = typeof it === 'string' ? it : it.label;
        const deletable = typeof it !== 'string' && isAdmin && onDeleteTag;

        return (
          <Tag
            key={key}
            onDelete={deletable ? () => onDeleteTag!(it.id) : undefined}
          >
            {label}
          </Tag>
        );
      })}
    </div>
  );
}
