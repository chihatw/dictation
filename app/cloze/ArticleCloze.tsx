import { ClozeLine } from '@/types/dictation';
import ClozeRow from './ClozeRow';

function ArticleCloze({ title, lines }: { title: string; lines: ClozeLine[] }) {
  return (
    <section className='w-full rounded-lg border bg-white py-3 px-4 flex flex-col gap-2'>
      <header>
        <h2 className='text-lg font-bold'>{title}</h2>
      </header>

      <div className='flex flex-col gap-2'>
        {lines.map((line, idx) => (
          <div key={idx}>
            <ClozeRow line={line} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default ArticleCloze;
