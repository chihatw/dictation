'use client';
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { makeClozeText } from '@/utils/cloze/converter';
import { useEffect, useState } from 'react';

import { Journal } from '@/types/dictation';
import ClozeCarouselController from './ClozeCarouselController';
import JournalCarouselItem from './JournalCarouselItem';
import LineCarouselItem from './LineCarouselItem';

type Unit = 'journal' | 'line';
type Order = 'seq' | 'rand';

type Props = {
  journals: Journal[];
  defaultUnit?: Unit; // from searchParams
  defaultOrder?: Order; // from searchParams
};

type LineItem = {
  type: 'line';
  journal: Journal;
  lineText: string;
  lineIndex: number;
};

type JournalItem = {
  type: 'journal';
  journal: Journal;
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
        <ClozeCarouselController
          isJournalUnit={unit === 'journal'}
          isSeqOrder={order === 'seq'}
          handleReset={handleReset}
          setJournalUnit={() => setUnit('journal')}
          setLineUnit={() => setUnit('line')}
          setSeqOrder={() => setOrder('seq')}
          setRandomOrder={() => setOrder('rand')}
        />

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
            {items.map((it, i) =>
              it.type === 'journal' ? (
                <JournalCarouselItem
                  key={`j-${it.journal.id}-${i}`}
                  journal={it.journal}
                />
              ) : (
                <LineCarouselItem
                  key={`l-${it.journal.id}-${it.lineIndex}-${i}`}
                  journal={it.journal}
                  lineText={it.lineText}
                />
              )
            )}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ClozeWorkout;
