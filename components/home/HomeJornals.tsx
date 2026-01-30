// components/HomeJournals.tsx ("use client")
'use client';
import { fetchMoreJournals } from '@/app/actions/fetchMoreJournals';
import { Vote } from '@/components/journal/Vote';
import { supabase } from '@/lib/supabase/browser';
import { ClozeSpan, Journal, SelfAward } from '@/types/dictation';
import { makeClozeText, parseCloze } from '@/utils/cloze/converter';
import { Award, LinkIcon } from 'lucide-react';
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
        locked,
        self_award
        `,
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
      self_award: i.self_award as SelfAward,
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
          id, assignment_id, created_at, article_id, body, rating_score, cloze_spans, locked, self_award
        `,
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
            self_award: data.self_award as SelfAward,
          } satisfies Journal;

          setItems((prev) => [j, ...prev]);
          // ページネーション用の before は必要なら再計算
          setBefore((prev) => prev ?? j.created_at);
        },
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
      <div className='text-sm text-gray-500'>最近的學習日誌</div>
      <div>
        <ul className='space-y-4'>
          {items.map((j) => {
            const clozeText = makeClozeText(j.body.trim(), j.cloze_spans);
            return (
              <li key={j.id} className='rounded border p-3 bg-slate-50'>
                <div className='flex justify-between pr-2'>
                  <JournalLinkHeader journal={j} />
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

                <Vote journal={j} />
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

const JournalLinkHeader = ({ journal }: { journal: Journal }) => {
  const date = new Date(journal.created_at);
  return (
    <div className='flex items-center justify-between w-full'>
      <Link href={`/articles/${journal.article_id}`} className='block'>
        <div className='flex items-center hover:underline gap-x-1'>
          {['mbest'].includes(journal.self_award) && (
            <span>
              <Award className='w-5 h-5 text-yellow-500' fill='currentColor' />
            </span>
          )}
          {['mhm'].includes(journal.self_award) && (
            <span>
              <Award className='w-5 h-5 text-gray-400' fill='currentColor' />
            </span>
          )}
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
      {!journal.locked && (
        <Link
          href={`/cloze/${journal.id}/edit`}
          className='text-xs rounded border px-2 py-1 text-slate-500 cursor-pointer hover:bg-slate-200'
        >
          {!journal.cloze_spans.length ? `建立填空題` : `修改填空題`}
        </Link>
      )}
    </div>
  );
};
