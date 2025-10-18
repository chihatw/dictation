'use client';

import { saveDictationJournalAction } from '@/app/actions/saveDictationJournal';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { supabase } from '@/lib/supabase/browser';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

type AnswerRow = {
  seq: number;
  content: string;
  answer: string;
  ai_feedback_md: string;
};

const PLACEHOLDERS = [
  '記住「割る（打蛋）」和「混ぜる（攪拌）」，做料理的時候常常會用，多練習用日語來說步驟。',
  '「部屋の中は甘いにおいがしました（房間裡有甜甜的味道）」這句很有畫面，下次寫心情或場景時用用看。',
  '「丸くて、金色に光っていました（圓圓的、閃著金色的光）」可以學到形容詞連用，作文會更漂亮。',
  '「うれしくなりました（變得很開心）」很實用，可以表達日常生活的感覺，多學一些感情的詞來搭配。',
  '「次に（接著）」這個詞能讓文章更有順序，寫日記時特別好用，要記得加進去。',
  '「評価の時期が近づいて（評估的時期快到了）」這個開頭可以用來描述時間上的壓力，寫作文時很實用。',
  '「パソコンのフォルダには大量の資料が入っていた（電腦資料夾裡有大量資料）」這句能學到日語裡常見的IT場景表達。',
  '「画面を見ているだけで頭が痛くなった（光是看畫面就覺得頭痛）」很生活化，可以用來寫壓力或心情。',
  '「一人で整理しようとしたが、すぐに諦めた（想自己整理，但馬上放棄了）」這種結構可以練習「〜しようとしたが〜」的用法。',
  '「分かりやすいひょうと要点にまとめてくれた（幫我整理成清楚的表格和重點）」很有用，可以在學校報告或工作裡用到。',
  '「助かった（得到幫助了）」這個詞很口語，適合日常生活常用。',
  '今天學到「次に」，好像蠻常用的，記一下。',
  '那句「部屋の中は甘いにおいがしました」蠻有畫面，但我只想到蛋糕。',
  '「うれしくなりました」很好用，不過我現在只是有點睏。',
  '文裡出現「丸くて」，原來形容東西圓圓的可以這樣講。',
  '「助かった」這個詞很短，記起來應該不難吧。',
  '今天聽的時候，一直卡在「混ぜる」，腦中只有打蛋器的畫面。',
  '「一人で整理しようとしたが〜」的結構看起來很實用，不過我現在只想整理房間。',
  '那個 IT 用語的句子有點難，但好像對報告會有幫助。',
  '「画面を見ているだけで頭が痛くなった」→ 我看書也常常這樣（笑）。',
  '有些詞今天聽不懂，但感覺下次寫日記應該能用到一點點。',
  '今天好累，不想寫太多，就這樣。',
  '其實我忘記內容了，亂寫幾個字。',
  '文法好像怪怪的，但算了。',
  '只想說一句：肚子餓。',
  '今天下雨，心情普普通通。',
  '邊聽音樂邊寫，感覺還可以。',
  '電腦卡住了，先抱怨一下。',
  '狗狗很可愛，以上。',
  '寫太短嗎？算了，先交吧。',
  '手機快沒電了，快快快。',
];

function getRandomPlaceholders(n: number) {
  // フィッシャー–イェーツで軽量シャッフル
  const a = PLACEHOLDERS.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n).join('\n');
}

export function useJournalModal() {
  const [open, setOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AnswerRow[]>([]);
  const [body, setBody] = useState('');
  const [placeholder, setPlaceholder] = useState('');

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
    setPlaceholder('');
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
          { p_article_id: articleId }
        );
        if (error) throw error;
        if (!cancelled) {
          setRows((data ?? []) as AnswerRow[]);
          setPlaceholder(getRandomPlaceholders(2));
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
    if (!open || loading || rows.length === 0) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight; // 行追加後に下端へ
  }, [open, loading, rows.length]);

  const save = useCallback(() => {
    if (!articleId || !body.trim() || loading) return;
    startTransition(async () => {
      try {
        await saveDictationJournalAction(articleId, body.trim());
        close(); // 成功時は閉じる
      } catch {
        // 失敗時は何もしない（必要ならトーストへ差し替え）
      }
    });
  }, [articleId, body, loading, close]);

  const canSave = useMemo(
    () => !!body.trim() && !loading && !isPending,
    [body, loading, isPending]
  );

  const sortedRows = useMemo(
    () => rows.slice().sort((a, b) => a.seq - b.seq),
    [rows]
  );

  const JournalModalElement = useMemo(() => {
    if (!open) return null;
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
        <div className='w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl flex flex-col max-h-[85vh] overflow-hidden'>
          <h2 className='text-lg font-semibold'>學習日誌</h2>

          <p className='mt-2 text-sm text-gray-700'>
            你剛才聽了根據自己作文改寫的日語句子，有沒有發現新的東西呢？
            <br />
            三天之後，你可能就忘記了。
            <span className='font-bold text-red-500'>
              請為未來的自己留下筆記
            </span>
            。
          </p>

          <div
            ref={listRef}
            className='mt-3 max-h-[40vh] overflow-auto rounded border p-3 text-sm'
          >
            {loading ? (
              <div className='h-5 w-1/3 animate-pulse rounded bg-gray-200' />
            ) : sortedRows.length === 0 ? (
              <p className='text-gray-500'>資料がありません。</p>
            ) : (
              <ul className='space-y-2'>
                {sortedRows.map((r) => (
                  <li key={r.seq} className='rounded border p-2 bg-gray-50'>
                    <div className='font-medium'>
                      #{r.seq}　{r.content}
                    </div>
                    <div className='mt-1 text-gray-700 mb-2'>
                      你的回答：{r.answer}
                    </div>
                    <div className='rounded border p-2 bg-white'>
                      <MarkdownRenderer markdown={r.ai_feedback_md} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <label className='mt-4 block text-sm font-medium'>日誌內容</label>
          <textarea
            className='mt-1 h-40 w-full resize-y rounded border p-2 text-sm'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={placeholder}
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
  }, [
    open,
    loading,
    sortedRows,
    body,
    placeholder,
    canSave,
    isPending,
    save,
    close,
  ]);

  return { openJournalModal, JournalModalElement };
}
