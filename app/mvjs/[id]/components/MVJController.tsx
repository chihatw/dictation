import { SortKey } from './MVJPicker';

export const MVJController = ({
  sort,
  ratingDescSort,
  createdAtAscSort,
  createdAtDescSort,
}: {
  sort: SortKey;

  ratingDescSort: () => void;
  createdAtDescSort: () => void;
  createdAtAscSort: () => void;
}) => {
  return (
    <div className='mb-4 flex items-center gap-2'>
      <span className='text-sm text-zinc-600 pl-2'>排序</span>
      <div className='inline-flex overflow-hidden rounded-lg border bg-white shadow-sm'>
        <button
          type='button'
          aria-pressed={sort === 'rating_desc'}
          onClick={ratingDescSort}
          className={[
            'border-l px-3 py-1.5 text-sm',
            sort === 'rating_desc'
              ? 'bg-zinc-900 text-white'
              : 'hover:bg-zinc-50',
          ].join(' ')}
        >
          評分高優先
        </button>
        <button
          type='button'
          aria-pressed={sort === 'created_desc'}
          onClick={createdAtDescSort}
          className={[
            'px-3 py-1.5 text-sm',
            sort === 'created_desc'
              ? 'bg-zinc-900 text-white'
              : 'hover:bg-zinc-50',
          ].join(' ')}
        >
          由新到舊
        </button>
        <button
          type='button'
          aria-pressed={sort === 'created_asc'}
          onClick={createdAtAscSort}
          className={[
            'border-l px-3 py-1.5 text-sm',
            sort === 'created_asc'
              ? 'bg-zinc-900 text-white'
              : 'hover:bg-zinc-50',
          ].join(' ')}
        >
          由舊到新
        </button>
      </div>
    </div>
  );
};
