'use client';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Journal } from '@/types/dictation';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

type Props = {
  assignmentId: string;
  allJournals: Journal[];
  selectedIds: string[];
  defaultAll: boolean;
};

export default function JournalsPicker({
  assignmentId,
  allJournals,
  selectedIds,
  defaultAll,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    return new Set(defaultAll ? allJournals.map((j) => j.id) : selectedIds);
  }, [defaultAll, allJournals, selectedIds]);

  const commit = (ids: string[]) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    params.set('assignment_id', assignmentId);
    // 空配列は「0件選択」を意味するため空文字をセット
    params.set('journal_ids', ids.length ? ids.join(',') : '');
    router.push(`${url.pathname}?${params.toString()}`);
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    commit(Array.from(next));
  };

  const selectAll = () => commit(allJournals.map((j) => j.id));
  const clearAll = () => commit([]);

  const visibleCount = selected.size;

  return (
    <Collapsible open={open} onOpenChange={setOpen} className='space-y-3'>
      {/* 常時表示バー */}
      <div className='flex items-center justify-between pl-2 pr-3 py-2'>
        <p className='text-sm text-slate-700 font-bold'>
          復習這 {visibleCount} 篇學習日誌
        </p>
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='flex items-center gap-1 text-sm text-slate-600'
            aria-label={open ? '收起' : '展開'}
          >
            {open ? '收起' : '挑選日誌'}
            <ChevronDown
              className={`size-4 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
            />
          </button>
        </CollapsibleTrigger>
      </div>

      {/* 折り畳み内容 */}
      <CollapsibleContent className='space-y-3'>
        <div className='bg-white rounded-lg p-2 m-2 relative'>
          <div className='flex items-center justify-end gap-2 absolute right-2'>
            {allJournals.length !== selected.size && (
              <button
                type='button'
                onClick={selectAll}
                className='rounded-lg border px-2 py-1 text-sm cursor-pointer hover:bg-gray-200'
              >
                全部選取
              </button>
            )}
            {selected.size !== 0 && (
              <button
                type='button'
                onClick={clearAll}
                className='rounded-lg border px-2 py-1 text-sm cursor-pointer hover:bg-gray-200'
              >
                全部取消
              </button>
            )}
          </div>

          <ul className='max-h-64 overflow-auto '>
            {allJournals.map((j) => {
              const date = new Date(j.created_at);
              const checked = selected.has(j.id);
              return (
                <li key={j.id} className='px-2'>
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={() => toggle(j.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle(j.id);
                      }
                    }}
                    className='w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 text-left'
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(j.id)}
                      className='size-4'
                      aria-label='select journal'
                    />
                    <span className='flex items-center gap-x-1 text-sm'>
                      <time className='pr-1 font-bold'>
                        {date.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          timeZone: 'Asia/Taipei',
                        })}
                      </time>
                      <time className='text-sm font-light text-slate-500'>
                        {date.toLocaleString('ja-JP', {
                          hour: 'numeric',
                          minute: 'numeric',
                          timeZone: 'Asia/Taipei',
                        })}
                      </time>
                      <span>
                        {j.body.trim().split('\n').filter(Boolean).length}行
                      </span>
                    </span>
                  </div>
                </li>
              );
            })}
            {!allJournals.length && (
              <li className='px-3 py-2 text-sm text-slate-500'>沒有日誌</li>
            )}
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
