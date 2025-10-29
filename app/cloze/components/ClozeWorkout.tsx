'use client';
import { type CarouselApi } from '@/components/ui/carousel';
import { Progress } from '@/components/ui/progress';
import { makeClozeText } from '@/utils/cloze/converter';
import { useEffect, useState } from 'react';

import { Journal } from '@/types/dictation';
import { useQuerySync } from '../hooks/useQuerySync';
import { ClozeCarouselItem, LineItem, Order, Unit } from '../types';
import { shuffle } from '../utils/shuffle';
import ClozeCarousel from './ClozeCarousel';
import ClozeCarouselController from './ClozeCarouselController';

type Props = {
  journals: Journal[];
  defaultUnit?: Unit;
  defaultOrder?: Order;
};

const ClozeWorkout = ({
  journals,
  defaultUnit = 'journal',
  defaultOrder = 'seq',
}: Props) => {
  const { setQuery } = useQuerySync();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [index, setIndex] = useState(1);
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [items, setItems] = useState<ClozeCarouselItem[]>([]);

  const setUnitAndSync = (u: Unit) => {
    setUnit(u);
    setQuery({ unit: u });
  };
  const setOrderAndSync = (o: Order) => {
    setOrder(o);
    setQuery({ order: o });
  };

  useEffect(() => {
    const genItems = (): ClozeCarouselItem[] => {
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
          setJournalUnit={() => setUnitAndSync('journal')}
          setLineUnit={() => setUnitAndSync('line')}
          setSeqOrder={() => setOrderAndSync('seq')}
          setRandomOrder={() => setOrderAndSync('rand')}
        />

        {/* 進捗バー */}
        <div className='flex items-center gap-3'>
          <Progress value={pct} className='h-2 flex-1' />
          <span className='text-xs text-slate-600'>
            {index}/{count}
          </span>
        </div>

        {/* 本体 */}
        <ClozeCarousel items={items} setApi={setApi} />
      </div>
    </div>
  );
};

export default ClozeWorkout;
