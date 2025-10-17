'use client';
import ClozeRow from '@/components/cloze/ClozeRow';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { makeClozeText, parseCloze } from '@/utils/cloze/converter';
import { RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Vote } from '../journals/Vote';
import { ClozeWorkoutJournal } from './page';

type Props = {
  journals: ClozeWorkoutJournal[];
};

const ClozeWorkout = ({ journals }: Props) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(1);
  const [count, setCount] = useState(Math.max(journals.length, 1));

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    const update = () => setIndex(api.selectedScrollSnap() + 1);
    update();
    api.on('select', update);
    return () => {
      api.off('select', update);
    };
  }, [api]);

  const pct = Math.round((index / count) * 100);

  const handleReset = () => {
    if (!api) return;
    api.scrollTo(0);
    setIndex(1);
  };

  return (
    <div>
      <div className='w-full space-y-3'>
        <div className='flex justify-end'>
          <button
            className='bg-white rounded p-2 border hover:bg-slate-50 cursor-pointer'
            onClick={handleReset}
          >
            <RotateCcw className='h-4 w-4' />
          </button>
        </div>
        {/* 進捗バー */}
        <div className='flex items-center gap-3'>
          <Progress value={pct} className='h-2 flex-1' />
        </div>
        <Carousel
          className='w-full'
          opts={{ loop: false, align: 'start' }}
          setApi={setApi}
        >
          <CarouselContent>
            {journals.map((j, index) => {
              const clozeText = makeClozeText(j.body.trim(), j.cloze_spans);
              return (
                <CarouselItem key={index} className='basis-full'>
                  <section className='bg-white rounded-lg py-3 px-4 border'>
                    <ClozeCarouselHeader
                      articleId={j.article_id}
                      createdAt={j.created_at}
                    />

                    <div className='flex flex-col gap-2 mb-4'>
                      {clozeText.split('\n').map((text, i) => {
                        const objs = parseCloze(text);
                        return (
                          <div key={i}>
                            <ClozeRow objs={objs} />
                          </div>
                        );
                      })}
                    </div>
                    <Vote
                      id={j.id}
                      initialScore={j.rating_score}
                      createdAt={j.created_at}
                    />
                  </section>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ClozeWorkout;

const ClozeCarouselHeader = ({
  articleId,
  createdAt,
}: {
  articleId: string;
  createdAt: string;
}) => {
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
