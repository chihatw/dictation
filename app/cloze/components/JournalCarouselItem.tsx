import { Vote } from '@/app/journals/Vote';
import ClozeRow from '@/components/cloze/ClozeRow';
import { CarouselItem } from '@/components/ui/carousel';
import { Journal } from '@/types/dictation';
import { makeClozeText, parseCloze } from '@/utils/cloze/converter';
import ClozeCarouselHeader from './ClozeCarouselHeader';

type Props = {
  journal: Journal;
};

const JournalCarouselItem = ({ journal }: Props) => {
  const j = journal;
  const clozeText = makeClozeText(j.body.trim(), j.cloze_spans);
  return (
    <CarouselItem className='basis-full'>
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
};

export default JournalCarouselItem;
