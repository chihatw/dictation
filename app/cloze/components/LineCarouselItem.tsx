import ClozeRow from '@/components/cloze/ClozeRow';
import { Vote } from '@/components/journal/Vote';
import { CarouselItem } from '@/components/ui/carousel';
import { Journal } from '@/types/dictation';
import { parseCloze } from '@/utils/cloze/converter';
import ClozeCarouselHeader from './ClozeCarouselHeader';

type Props = {
  journal: Journal;
  lineText: string;
};

const LineCarouselItem = ({ journal, lineText }: Props) => {
  const j = journal;
  const objs = parseCloze(lineText);
  return (
    <CarouselItem className='basis-full'>
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
};

export default LineCarouselItem;
