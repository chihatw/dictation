import Link from 'next/link';

type Props = {
  articleId: string;
  createdAt: string;
};

const ClozeCarouselHeader = ({ createdAt, articleId }: Props) => {
  const date = new Date(createdAt);
  return (
    <header className='flex mb-2'>
      <Link href={`/articles/${articleId}`}>
        <h2 className='flex items-baseline hover:underline'>
          <time className='font-bold pr-1'>
            {date.toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              timeZone: 'Asia/Taipei',
            })}
          </time>
          <time className='font-light text-slate-500 text-sm'>
            {date.toLocaleString('ja-JP', {
              hour: 'numeric',
              minute: 'numeric',
              timeZone: 'Asia/Taipei',
            })}
          </time>
        </h2>
      </Link>
    </header>
  );
};

export default ClozeCarouselHeader;
