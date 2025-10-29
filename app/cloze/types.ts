import { Journal } from '@/types/dictation';

export type Unit = 'journal' | 'line';
export type Order = 'seq' | 'rand';

export type LineItem = {
  type: 'line';
  journal: Journal;
  lineText: string;
  lineIndex: number;
};

type JournalItem = {
  type: 'journal';
  journal: Journal;
};

export type ClozeCarouselItem = LineItem | JournalItem;
