import { SelfAward } from '@/types/dictation';
import { Award } from 'lucide-react';
import Link from 'next/link';

type Props = {
  articleId: string;
  createdAt: string;
  selfAward: SelfAward;
};

const ClozeCarouselHeader = ({ createdAt, articleId, selfAward }: Props) => {
  const date = new Date(createdAt);
  return (
    <header className='flex mb-2'>
      <Link href={`/articles/${articleId}`}>
        <h2 className='flex items-baseline hover:underline'>
          {['mbest'].includes(selfAward) && (
            <span>
              <Award
                className='w-5 h-5 text-yellow-500 mb-[-3]'
                fill='currentColor'
              />
            </span>
          )}
          {['mhm'].includes(selfAward) && (
            <span>
              <Award
                className='w-5 h-5 text-gray-400 mb-[-3]'
                fill='currentColor'
              />
            </span>
          )}
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
