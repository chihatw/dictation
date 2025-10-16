// components/HomeJournals.tsx ("use client")
'use client';
import { fetchMoreJournals } from '@/app/actions/fetchMoreJournals';
import { Vote } from '@/app/journals/Vote';
import { Journal } from '@/types/dictation';
import { makeClozeText, parseCloze } from '@/utils/cloze/converter';
import { LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import ClozeRow from '../cloze/ClozeRow';

export function HomeJournals({
  initialItems,
  initialBefore,
  userId,
}: {
  initialItems: Journal[];
  initialBefore: string | null;
  userId: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [before, setBefore] = useState<string | null>(initialBefore);
  const [hasMore, setHasMore] = useState(true);
  const [pending, start] = useTransition();

  const onMore = () =>
    start(async () => {
      if (!before) {
        setHasMore(false);
        return;
      }
      const res = await fetchMoreJournals(userId, before); // server action

      if (!res || res.items.length === 0) {
        setHasMore(false);
        return;
      }
      setItems((prev) => [...prev, ...res.items]);
      setBefore(res.next_before);
      setHasMore(!!res.has_more);
    });

  return (
    <section className='rounded-xl border p-5 bg-white space-y-4'>
      <h2 className='text-lg font-semibold'>向過去的自己說聲謝謝</h2>

      <div className='text-sm text-slate-700 space-y-0'>
        <p>
          <span className='font-extrabold'>過去的你</span>
          在忙碌之中把握每一點空檔學習，
          <span className='font-extrabold'>為了今天的你，留下這本學習日誌</span>
          。
        </p>
        <p>
          如果覺得這些記錄<span className='font-extrabold'>有幫助</span>，
          <span className='font-bold'>請按「👍Good」</span>
          向過去的自己<span className='font-extrabold'>說聲謝謝</span>。
        </p>
        <p>
          若你覺得<span className='font-extrabold'>「這在寫什麼？」</span>或
          <span className='font-extrabold'>「這樣的筆記完全幫不上忙」</span>，
          <span className='font-extrabold'>請按「👎Bad」</span>
          提醒過去的自己<span className='font-extrabold'>需要改進</span>。
        </p>
        <p>
          <span className='font-extrabold'>
            給自己的感謝，或對自己的督促，都是讓你持續成長的力量
          </span>
          。
        </p>
        <p className='pt-2 text-xs font-extralight'>
          「👍 Good」和「👎 Bad」都可以按很多次，想按幾次都沒問題喔。
        </p>
      </div>
      <div>
        <ul className='space-y-4'>
          {items.map((j) => {
            const clozeText = makeClozeText(j.body.trim(), j.cloze_spans);
            return (
              <li key={j.id} className='rounded border p-3 bg-slate-50'>
                <div className='flex justify-between pr-2'>
                  <JournalLinkHeader
                    articleId={j.article_id}
                    createdAt={j.created_at}
                  />
                </div>

                <div className='mt-1 text-sm text-gray-700 space-y-1'>
                  {clozeText.split('\n').map((text, i) => {
                    const clozeObjLine = parseCloze(text);
                    return (
                      <div key={i}>
                        <ClozeRow objs={clozeObjLine} />
                      </div>
                    );
                  })}
                </div>

                <Vote
                  id={j.id}
                  initialScore={j.rating_score}
                  createdAt={j.created_at}
                />
              </li>
            );
          })}
        </ul>
        {hasMore && (
          <button
            disabled={pending}
            onClick={onMore}
            className='rounded-md border px-4 py-2 mt-2 w-full text-sm font-medium text-slate-700 hover:cursor-pointer hover:bg-slate-50 hover:underline underline-offset-2'
          >
            載入更早的學習日誌（每次最多 10 篇）
          </button>
        )}
      </div>
    </section>
  );
}

const JournalLinkHeader = ({
  articleId,
  createdAt,
}: {
  articleId: string;
  createdAt: string;
}) => {
  const date = new Date(createdAt);
  return (
    <Link href={`/articles/${articleId}`} className='block'>
      <div className='flex items-center hover:underline gap-x-1'>
        <time className='font-bold '>
          {date.toLocaleString('ja-JP', {
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
        <LinkIcon className='w-3 h-3 text-slate-500' />
      </div>
    </Link>
  );
};
