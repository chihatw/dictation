'use client';
import { Journal } from '@/types/dictation';
import { useEffect, useMemo, useState } from 'react';
import { JournalCard } from './JournalCard';
import { SelectedShelf } from './SelectedShelf';

const toLabel = (body: string) => {
  const first = (body.split('\n')[0] || '').trim();
  return first.length > 10 ? first.slice(0, 10) + '…' : first || '（無標題）';
};

type SortKey = 'created_desc' | 'created_asc' | 'rating_desc';

type Props = {
  items: Journal[];
};

export function MVJPicker({ items: initialItems }: Props) {
  const [items, setItems] = useState<Journal[]>(initialItems);
  const [bestId, setBestId] = useState<string | null>(null);
  const [hmIds, setHmIds] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('rating_desc');

  useEffect(() => {
    const mbests = initialItems.filter((j) => j.self_award === 'mbest');
    const mhms = initialItems.filter((j) => j.self_award === 'mhm');

    if (mbests.length > 1) {
      console.error('初期データに mbest が複数あります。1件にしてください。');
      // 何もセットしないで終了
      return;
    }

    const nextBest = mbests[0]?.id ?? null;
    // best と重複しない hm を作る
    const nextHms = mhms
      .map((j) => j.id)
      .filter((id, i, arr) => arr.indexOf(id) === i) // 重複除去
      .filter((id) => id !== nextBest); // best と衝突回避

    setBestId(nextBest);
    setHmIds(nextHms);
  }, [initialItems]);

  const applyScore = (id: string, score: number) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, rating_score: score } : it))
    );

  // 現状は同一処理
  const optimisticScore = applyScore;

  const recomputeAwards = (best: string | null, hms: string[]) => {
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        self_award:
          best === it.id ? 'mbest' : hms.includes(it.id) ? 'mhm' : 'none',
      }))
    );
  };

  const toggleBest = (id: string) =>
    setBestId((prevBest) => {
      const nextBest = prevBest === id ? null : id;
      // best と hm の衝突を排除しつつ同期
      setHmIds((prevHms) => {
        const nextHms = prevHms.filter((x) => x !== id);
        recomputeAwards(nextBest, nextHms);
        return nextHms;
      });
      return nextBest;
    });

  const toggleHM = (id: string) =>
    setHmIds((prevHms) => {
      const included = prevHms.includes(id);
      const nextHms = included
        ? prevHms.filter((x) => x !== id)
        : [...prevHms, id];

      // 追加時に best と衝突するなら best を外す
      const nextBest = !included && bestId === id ? null : bestId;
      if (nextBest !== bestId) setBestId(nextBest);

      recomputeAwards(nextBest, nextHms);
      return nextHms;
    });

  const submit = () => {
    // submit(bestId, hmIds)
  };

  const view = useMemo(() => {
    const arr = [...items];
    switch (sort) {
      case 'created_asc':
        return arr.sort(
          (a, b) => +new Date(a.created_at) - +new Date(b.created_at)
        );
      case 'rating_desc':
        return arr.sort(
          (a, b) =>
            b.rating_score - a.rating_score ||
            +new Date(b.created_at) - +new Date(a.created_at)
        );
      case 'created_desc':
      default:
        return arr.sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
        );
    }
  }, [items, sort]);

  const labelsById = useMemo(() => {
    const m: Record<string, string> = {};
    for (const it of items) m[it.id] = toLabel(it.body);
    return m;
  }, [items]);

  return (
    <main className='mx-auto max-w-6xl px-4 py-6'>
      {/* 選出棚 */}
      <SelectedShelf
        bestId={bestId}
        hmIds={hmIds}
        labelsById={labelsById}
        onClearBest={() => setBestId(null)}
        onToggleHM={toggleHM}
        onSubmit={submit}
      />

      {/* 並び替え */}
      <div className='mb-4 flex items-center gap-2'>
        <span className='text-sm text-zinc-600'>排序</span>
        <div className='inline-flex overflow-hidden rounded-lg border bg-white shadow-sm'>
          <button
            type='button'
            aria-pressed={sort === 'rating_desc'}
            onClick={() => setSort('rating_desc')}
            className={[
              'border-l px-3 py-1.5 text-sm',
              sort === 'rating_desc'
                ? 'bg-zinc-900 text-white'
                : 'hover:bg-zinc-50',
            ].join(' ')}
          >
            評分高優先
          </button>
          <button
            type='button'
            aria-pressed={sort === 'created_desc'}
            onClick={() => setSort('created_desc')}
            className={[
              'px-3 py-1.5 text-sm',
              sort === 'created_desc'
                ? 'bg-zinc-900 text-white'
                : 'hover:bg-zinc-50',
            ].join(' ')}
          >
            由新到舊
          </button>
          <button
            type='button'
            aria-pressed={sort === 'created_asc'}
            onClick={() => setSort('created_asc')}
            className={[
              'border-l px-3 py-1.5 text-sm',
              sort === 'created_asc'
                ? 'bg-zinc-900 text-white'
                : 'hover:bg-zinc-50',
            ].join(' ')}
          >
            由舊到新
          </button>
        </div>
      </div>

      {/* 一覧 */}
      <section className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3'>
        {view.map((j) => (
          <JournalCard
            key={j.id}
            journal={j}
            isBest={bestId === j.id}
            isHM={hmIds.includes(j.id)}
            onToggleBest={toggleBest}
            onToggleHM={toggleHM}
            onScoreOptimistic={(score) => optimisticScore(j.id, score)}
            onScoreSettled={(score) => applyScore(j.id, score)}
          />
        ))}
      </section>
    </main>
  );
}
