'use client';

import ClozeCarousel from '@/app/cloze/components/ClozeCarousel';
import { ClozeSpan, Journal, JournalView, SelfAward } from '@/types/dictation';
import { makeClozeText } from '@/utils/cloze/converter';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CarouselApi } from '../ui/carousel';

type Props = {
  journal: JournalView;
};

type LineItem = {
  type: 'line';
  journal: Journal;
  lineText: string;
  lineIndex: number;
};

const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const HomeCloze = ({ journal }: Props) => {
  const [, setApi] = useState<CarouselApi | null>(null);

  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    if (!journal) return;

    const genItems = (): LineItem[] => {
      const clozeText = makeClozeText(
        journal.body?.trim() ?? '',
        journal.cloze_spans as ClozeSpan[]
      );
      return clozeText
        .split('\n')
        .filter(Boolean)
        .map((lineText, i) => ({
          type: 'line' as const,
          journal: {
            article_id: journal.article_id as string,
            body: journal.body as string,
            cloze_spans: journal.cloze_spans as ClozeSpan[],
            created_at: journal.created_at as string,
            id: journal.id as string,
            rating_score: journal.rating_score as number,
            locked: journal.locked as boolean,
            self_award: journal.self_award as SelfAward,
          },
          lineText,
          lineIndex: i,
        }));
    };

    setItems(shuffle(genItems()));
  }, [journal]);

  return (
    <section className='rounded-xl border p-5 bg-white space-y-3'>
      <div className='text-sm text-gray-500'>複習</div>
      <ClozeCarousel items={items} setApi={setApi} />
      <Link
        href={`/cloze?assignment_id=${journal.assignment_id}&journal_ids=${journal.id}&order=rand&unit=line`}
        className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors'
      >
        更多複習
      </Link>
    </section>
  );
};

export default HomeCloze;
