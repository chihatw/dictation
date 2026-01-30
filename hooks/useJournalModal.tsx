'use client';

import {
  saveDictationJournalAction,
  saveDictationJournalFromHome,
} from '@/app/actions/saveDictationJournal';
import { DictationResults } from '@/components/journalModal/DictationResults';
import { ModalDescription } from '@/components/journalModal/ModalDescription';
import { PromptCopySection } from '@/components/journalModal/PromptCopySection';
import { supabase } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

export type AnswerRow = {
  seq: number;
  content: string;
  answer: string;
  ai_feedback_md: string;
};

const AI_PROMPT = `我是日語學習者。
下面的對話是我自己寫的。
如果有
 - 文法錯誤的地方
 - 用詞不恰當的地方
 - 情節發展不自然的地方
請幫我修改。

在修改時，如果需要但缺少資訊（例如人物關係或情境設定），
請先向我提問。

我不想讀太長的內容，請盡量寫得簡潔。
不需要說明修改原因。`;

export function useJournalModal(opts?: { isFromHome?: boolean }) {
  const router = useRouter();
  const isFromHome = opts?.isFromHome ?? false;

  const [open, setOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AnswerRow[]>([]);
  const [body, setBody] = useState('');

  const [isPending, startTransition] = useTransition();

  const listRef = useRef<HTMLDivElement>(null);

  const openJournalModal = useCallback((id: string) => {
    setArticleId(id);
    setOpen(true);
  }, []);

  const reset = useCallback(() => {
    setArticleId(null);
    setRows([]);
    setBody('');
    setLoading(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    reset();
  }, [reset]);

  // 初期データ取得
  useEffect(() => {
    if (!open || !articleId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc(
          'get_article_answers_for_modal',
          { p_article_id: articleId },
        );
        if (error) throw error;
        if (!cancelled) {
          setRows((data ?? []) as AnswerRow[]);
        }
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, articleId]);

  useLayoutEffect(() => {
    if (!open || loading) return;
    const el = listRef.current;
    if (!el) return;

    if (isFromHome) return;

    if (rows.length > 0) el.scrollTop = el.scrollHeight;
  }, [open, loading, rows.length, isFromHome]);

  const save = useCallback(() => {
    if (!articleId || !body.trim() || loading) return;
    startTransition(async () => {
      try {
        if (isFromHome) {
          await saveDictationJournalFromHome(articleId, body.trim());
          router.refresh();
        } else {
          await saveDictationJournalAction(articleId, body.trim());
        }
        close();
      } catch {}
    });
  }, [articleId, body, loading, close]);

  const canSave = useMemo(
    () => !!body.trim() && !loading && !isPending,
    [body, loading, isPending],
  );

  const sortedRows = useMemo(
    () => rows.slice().sort((a, b) => a.seq - b.seq),
    [rows],
  );

  const JournalModalElement = useMemo(() => {
    if (!open) return null;
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
        <div className='w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl flex flex-col max-h-[85vh] overflow-hidden'>
          <h2 className='text-lg font-semibold'>學習日誌</h2>

          <ModalDescription />

          <PromptCopySection prompt={AI_PROMPT} />

          <DictationResults
            loading={loading}
            listRef={listRef}
            sortedRows={sortedRows}
          />

          <label className='mt-4 block text-sm font-medium'>日誌內容</label>
          <textarea
            className='mt-1 h-40 w-full resize-y rounded border p-2 text-sm'
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <div className='mt-4 flex justify-end gap-2'>
            <button
              className='rounded bg-black px-3 py-1.5 text-white disabled:opacity-40'
              onClick={save}
              disabled={!canSave}
              type='button'
            >
              {isPending ? '保存中…' : '保存'}
            </button>
          </div>
        </div>
      </div>
    );
  }, [open, loading, sortedRows, body, canSave, isPending, save, close]);

  return { openJournalModal, JournalModalElement };
}
