import { CircleQuestionMark } from 'lucide-react';
import Link from 'next/link';
import JournalQuickWriteButton from './JournalQuickWriteButton';

export const NextTask = ({
  nextArticleId,
  totalCount,
  doneCount,
  assignmentId,
  nextFullTitle,
  nextSentenceSeq,
  title,
}: {
  nextArticleId: string | null | undefined;
  totalCount: number | null;
  doneCount: number;
  assignmentId: string;
  nextFullTitle: string | null;
  nextSentenceSeq: number | null;
  title: string | null;
}) => {
  const pct = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;
  return (
    <section className='rounded-xl border p-5 bg-white space-y-3'>
      <div className='flex items-start justify-between'>
        <div className='text-sm text-gray-500'>作業</div>
        <button
          type='button'
          aria-label='語言學習重在習慣。 與其一天做很多，不如盡量每天都做一點。'
          className='relative inline-flex text-slate-400 transition-colors focus:outline-none focus-visible:text-slate-600 group'
        >
          <CircleQuestionMark className='h-4 w-4 group-hover:text-slate-600' />
          <span className='pointer-events-none absolute right-0 top-full z-10 mt-2 w-60 rounded-md bg-slate-900 px-3 py-2 text-xs font-light leading-relaxed text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100'>
            語言學習重在習慣。 與其一天做很多，不如盡量每天都做一點。
          </span>
        </button>
      </div>

      <div className='text-sm text-gray-700'>
        作業進度<span className='pl-2 font-bold text-4xl'>{pct}</span>%
      </div>

      <JournalQuickWriteButton assignment_id={assignmentId} />

      {nextArticleId ? (
        <Link
          href={`/articles/${nextArticleId}`}
          className='text-sm inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 transition-colors'
        >
          {`前往「${nextFullTitle}」第 ${nextSentenceSeq ?? ''} 行`}
        </Link>
      ) : (
        <div>
          <div className='text-sm  text-gray-700 mb-4'>
            所有作業都結束了，辛苦了！🎉
          </div>
          <Link
            href={`/assignments/${assignmentId}`}
            className='inline-flex items-center rounded-xl px-4 py-2 border text-gray-700 text-sm'
          >
            {`查看「${title ?? ''}」的成果`}
          </Link>
        </div>
      )}
    </section>
  );
};
