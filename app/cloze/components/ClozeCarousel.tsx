import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';

import { ClozeCarouselItem } from '../types';
import JournalCarouselItem from './JournalCarouselItem';
import LineCarouselItem from './LineCarouselItem';

type Props = {
  items: ClozeCarouselItem[];
  setApi: (api: CarouselApi | undefined) => void;
};

const ClozeCarousel = ({ items, setApi }: Props) => {
  return (
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
      <CarouselPrevious className='absolute -left-10 top-16 z-10' />
      <CarouselNext className='absolute -right-10 top-16 z-10' />
    </Carousel>
  );
};

export default ClozeCarousel;
