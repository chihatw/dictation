// components/HomeJournals.tsx ("use client")
'use client';
import { fetchMoreJournals } from '@/app/actions/fetchMoreJournals';
import { Vote } from '@/app/journals/Vote';
import { supabase } from '@/lib/supabase/browser';
import { ClozeSpan, Journal } from '@/types/dictation';
import { makeClozeText, parseCloze } from '@/utils/cloze/converter';
import { LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState, useTransition } from 'react';
import ClozeRow from '../cloze/ClozeRow';

export function HomeJournals({
  userId,
  topAssignmentIds, // todo useSWRInfinite
}: {
  userId: string;
  topAssignmentIds: string[];
}) {
  const [items, setItems] = useState<Journal[]>([]);
  const [before, setBefore] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [pending, start] = useTransition();

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('dictation_journals_view')
      .select(
        `
        id,
        assignment_id,
        created_at, 
        article_id, 
        body, 
        rating_score, 
        cloze_spans, 
        locked
        `
      )
      .in('assignment_id', topAssignmentIds)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(error.message);
      setItems([]);
      return;
    }
    const initialItems: Journal[] = (data ?? []).map((i) => ({
      id: i.id as string,
      created_at: i.created_at as string,
      article_id: i.article_id as string,
      body: i.body as string,
      rating_score: i.rating_score as number,
      cloze_spans: i.cloze_spans as ClozeSpan[],
      locked: i.locked as boolean,
    }));

    const initialBefore = initialItems.at(-1)?.created_at ?? null;

    setItems(initialItems);
    setBefore(initialBefore);
  }, [topAssignmentIds]);

  // 初期値設定
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // dictation_journals の追加を監視
  // 追加された場合、items の先頭に追加
  useEffect(() => {
    const ch = supabase
      .channel('journals-insert')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'dictation_journals',
        },
        async (payload) => {
          const id = (payload.new as { id: string }).id;
          const { data, error } = await supabase
            .from('dictation_journals_view')
            .select(
              `
          id, assignment_id, created_at, article_id, body, rating_score, cloze_spans, locked
        `
            )
            .eq('id', id)
            .single();
          if (error || !data) return;
          if (!topAssignmentIds.includes(data.assignment_id as string)) return;

          const j = {
            id: data.id as string,
            created_at: data.created_at as string,
            article_id: data.article_id as string,
            body: data.body as string,
            rating_score: data.rating_score as number,
            cloze_spans: data.cloze_spans as ClozeSpan[],
            locked: data.locked as boolean,
          } satisfies Journal;

          setItems((prev) => [j, ...prev]);
          // ページネーション用の before は必要なら再計算
          setBefore((prev) => prev ?? j.created_at);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ch);
    };
  }, [topAssignmentIds]);

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
