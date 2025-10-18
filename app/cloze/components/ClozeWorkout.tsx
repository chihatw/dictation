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
import { Vote } from '../../journals/Vote';
import { ClozeWorkoutJournal } from '../page';

type Unit = 'journal' | 'line';
type Order = 'seq' | 'rand';

type Props = {
  journals: ClozeWorkoutJournal[];
  defaultUnit?: Unit; // from searchParams
  defaultOrder?: Order; // from searchParams
};

type LineItem = {
  type: 'line';
  journal: ClozeWorkoutJournal;
  lineText: string;
  lineIndex: number;
};

type JournalItem = {
  type: 'journal';
  journal: ClozeWorkoutJournal;
};

type Item = LineItem | JournalItem;

const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ClozeWorkout = ({
  journals,
  defaultUnit = 'journal',
  defaultOrder = 'seq',
}: Props) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(1);
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const genItems = (): Item[] => {
      if (unit === 'journal') {
        return journals.map((j) => ({ type: 'journal', journal: j }));
      }
      const lineItems: LineItem[] = journals.flatMap((j) => {
        const clozeText = makeClozeText(j.body.trim(), j.cloze_spans);
        const lines = clozeText.split('\n').filter(Boolean);
        return lines.map((lineText, i) => ({
          type: 'line' as const,
          journal: j,
          lineText,
          lineIndex: i,
        }));
      });
      return order === 'rand' ? shuffle(lineItems) : lineItems;
    };

    setItems(genItems());
  }, [journals, unit, order]);

  const count = Math.max(items.length, 1);

  useEffect(() => {
    if (!api) return;
    const update = () => setIndex(api.selectedScrollSnap() + 1);
    update();
    api.on('select', update);
    return () => {
      api.off('select', update);
    };
  }, [api, items.length]);

  // 単位や順序を切り替えたら先頭へ
  useEffect(() => {
    if (!api) return;
    api.scrollTo(0);
    setIndex(1);
  }, [unit, order, api]);

  const pct = Math.round((index / count) * 100);

  const handleReset = () => {
    if (!api) return;
    // ランダムのときだけ再シャッフル
    if (order === 'rand' && unit === 'line') {
      setItems((prev) => shuffle(prev));
    }
    api.scrollTo(0);
    setIndex(1);
  };

  return (
    <div>
      <div className='w-full space-y-3'>
        {/* 操作列 */}
        <div className='flex items-center justify-between gap-2'>
          <div className='flex items-center gap-2'>
            {/* 単位切替 */}
            <div className='inline-flex rounded-lg border p-1'>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  unit === 'journal'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700'
                }`}
                onClick={() => setUnit('journal')}
              >
                以日誌顯示
              </button>
              <button
                className={`px-3 py-1 rounded-md text-sm ${
                  unit === 'line' ? 'bg-slate-900 text-white' : 'text-slate-700'
                }`}
                onClick={() => setUnit('line')}
              >
                以行顯示
              </button>
            </div>
            {/* 並び切替（行単位時のみ） */}
            {unit === 'line' && (
              <div className='inline-flex rounded-lg border p-1'>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    order === 'seq'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700'
                  }`}
                  onClick={() => setOrder('seq')}
                >
                  依序播放
                </button>
                <button
                  className={`px-3 py-1 rounded-md text-sm ${
                    order === 'rand'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700'
                  }`}
                  onClick={() => setOrder('rand')}
                >
                  隨機播放
                </button>
              </div>
            )}
          </div>

          <button
            className='bg-white rounded p-2 border hover:bg-slate-50 cursor-pointer'
            onClick={handleReset}
            aria-label='最初に戻る'
            title='最初に戻る'
          >
            <RotateCcw className='h-4 w-4' />
          </button>
        </div>

        {/* 進捗バー */}
        <div className='flex items-center gap-3'>
          <Progress value={pct} className='h-2 flex-1' />
          <span className='text-xs text-slate-600'>
            {index}/{count}
          </span>
        </div>

        {/* 本体 */}
        <Carousel
          className='w-full'
          opts={{ loop: false, align: 'start' }}
          setApi={setApi}
        >
          <CarouselContent>
            {items.map((it, i) => {
              if (it.type === 'journal') {
                const j = it.journal;
                const clozeText = makeClozeText(j.body.trim(), j.cloze_spans);
                return (
                  <CarouselItem key={`j-${j.id}-${i}`} className='basis-full'>
                    <section className='bg-white rounded-lg py-3 px-4 border'>
                      <ClozeCarouselHeader
                        articleId={j.article_id}
                        createdAt={j.created_at}
                      />
                      <div className='flex flex-col gap-2 mb-4'>
                        {clozeText
                          .split('\n')
                          .filter(Boolean)
                          .map((text, li) => {
                            const objs = parseCloze(text);
                            return (
                              <div key={li}>
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
              } else {
                const { journal: j, lineText, lineIndex } = it;
                const objs = parseCloze(lineText);
                return (
                  <CarouselItem
                    key={`l-${j.id}-${lineIndex}-${i}`}
                    className='basis-full'
                  >
                    <section className='bg-white rounded-lg py-3 px-4 border'>
                      <ClozeCarouselHeader
                        articleId={j.article_id}
                        createdAt={j.created_at}
                      />
                      <div className='mb-4'>
                        <ClozeRow objs={objs} />
                      </div>
                      <Vote
                        id={j.id}
                        initialScore={j.rating_score}
                        createdAt={j.created_at}
                      />
                    </section>
                  </CarouselItem>
                );
              }
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
