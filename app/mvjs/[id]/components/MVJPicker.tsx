'use client';
import { Journal, MVJ } from '@/types/dictation';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { submitMvjAndAwardsAction } from '../actions';
import { toLabel } from '../utils';
import { JournalCard } from './JournalCard';
import { MVJController } from './MVJController';
import { SelectedShelf } from './SelectedShelf';

export type SortKey = 'created_desc' | 'created_asc' | 'rating_desc';

type Props = {
  mvj: MVJ;
  items: Journal[];
};

export function MVJPicker({ mvj, items: initialItems }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Journal[]>(initialItems);
  const [reason, setReason] = useState(mvj.reason ?? '');
  const [serverReason, setServerReason] = useState(mvj.reason ?? '');
  const [imageUrl, setImageUrl] = useState(mvj.image_url ?? '');
  const [serverImageUrl, setSeverImageUrl] = useState(mvj.image_url ?? '');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setReason(mvj?.reason ?? '');
  }, [mvj]);

  // 導出
  const bestId = useMemo(
    () => items.find((j) => j.self_award === 'mbest')?.id ?? null,
    [items]
  );
  const hmIds = useMemo(
    () => items.filter((j) => j.self_award === 'mhm').map((j) => j.id),
    [items]
  );
  const initialBestId = useMemo(
    () => initialItems.find((j) => j.self_award === 'mbest')?.id ?? null,
    [initialItems]
  );
  const initialHmIds = useMemo(
    () => initialItems.filter((j) => j.self_award === 'mhm').map((j) => j.id),
    [initialItems]
  );

  const [sort, setSort] = useState<SortKey>('rating_desc');

  // スコア更新
  const applyScore = (id: string, score: number) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, rating_score: score } : it))
    );
  const optimisticScore = applyScore;

  // トグル（SSOT: items）
  const toggleBest = (id: string) =>
    setItems((prev) => {
      const isBest = prev.some((j) => j.id === id && j.self_award === 'mbest');
      return prev.map((j) => {
        if (j.id === id) return { ...j, self_award: isBest ? 'none' : 'mbest' };
        // best は一意。別の mbest は none に。
        if (!isBest && j.self_award === 'mbest')
          return { ...j, self_award: 'none' };
        // HM との衝突排除
        if (!isBest && j.id === id && j.self_award === 'mhm')
          return { ...j, self_award: 'mbest' };
        return j;
      });
    });

  const toggleHM = (id: string) =>
    setItems((prev) =>
      prev.map((j) => {
        if (j.id !== id) return j;
        if (j.self_award === 'mhm') return { ...j, self_award: 'none' };
        // best と衝突しないように
        if (j.self_award === 'mbest') return { ...j, self_award: 'none' };
        return { ...j, self_award: 'mhm' };
      })
    );

  const submit = () => {
    const initialIds = initialItems.map((i) => i.id);
    startTransition(() => {
      (async () => {
        const res = await submitMvjAndAwardsAction({
          mvjId: mvj.id,
          imageUrl,
          reason,
          initialIds,
          bestId,
          hmIds,
        });
        setServerReason(res.reason); // 直ちに canSubmit が false になる
        setImageUrl(res.imageUrl);
        router.refresh(); // サーバー側を再取得
      })();
    });
  };

  // 並び替えビュー
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
    <main className='mx-auto max-w-6xl px-4 pb-6'>
      <SelectedShelf
        bestId={bestId}
        hmIds={hmIds}
        initialBestId={initialBestId}
        initialHmIds={initialHmIds}
        labelsById={labelsById}
        reason={reason}
        serverReason={serverReason}
        onReasonChange={setReason}
        imageUrl={imageUrl}
        serverImageUrl={serverImageUrl}
        onImageUrlChange={setImageUrl}
        onClearBest={() => {
          if (bestId) toggleBest(bestId);
        }}
        onToggleHM={toggleHM}
        onSubmit={submit}
        dueAt={new Date(mvj.due_at)}
        isPending={isPending}
      />

      <MVJController
        sort={sort}
        ratingDescSort={() => setSort('rating_desc')}
        createdAtAscSort={() => setSort('created_asc')}
        createdAtDescSort={() => setSort('created_desc')}
      />

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
