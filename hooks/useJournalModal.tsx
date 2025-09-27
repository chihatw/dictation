'use client';

import { supabase } from '@/lib/supabase/browser';
import { useCallback, useEffect, useMemo, useState } from 'react';

type OpenArgs = { articleId: string; userId?: string };

type AnswerRow = { seq: number; content: string; answer: string };

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
];

// 配列をシャッフルして先頭3つを改行で結合
function getRandomPlaceholders(n: number) {
  const shuffled = [...PLACEHOLDERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).join('\n');
}

export function useJournalModal() {
  const [open, setOpen] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<AnswerRow[]>([]);
  const [body, setBody] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  const openJournalModal = useCallback(({ articleId, userId }: OpenArgs) => {
    setArticleId(articleId);
    setUserId(userId);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setArticleId(null);
    setUserId(undefined);
    setRows([]);
    setBody('');
    setPlaceholder('');
    setLoading(false);
  }, []);

  // 初期データ取得
  useEffect(() => {
    if (!open || !articleId) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const ansArgs = userId
          ? { p_article_id: articleId, p_user_id: userId }
          : { p_article_id: articleId };

        const { data: answers } = await supabase.rpc(
          'get_article_answers_for_modal',
          ansArgs
        );

        if (!cancelled) {
          setRows((answers ?? []) as AnswerRow[]);
          setPlaceholder(getRandomPlaceholders(2));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, articleId, userId]);

  const save = useCallback(async () => {
    if (!articleId || !body.trim()) return;

    const saveArgs = userId
      ? { p_article_id: articleId, p_body: body, p_user_id: userId }
      : { p_article_id: articleId, p_body: body };

    const { error } = await supabase.rpc('save_dictation_journal', saveArgs);
    if (error) {
      alert('保存に失敗しました。');
      return;
    }
    close();
  }, [articleId, body, userId, close]);

  const canSave = useMemo(() => !!body.trim() && !loading, [body, loading]);

  const JournalModalElement = useMemo(() => {
    if (!open) return null;
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
        {/* パネル：高さは画面の85%まで。中身は縦flexで、上をスクロール域に限定 */}
        <div className='w-full max-w-3xl rounded-lg bg-white p-4 shadow-xl flex flex-col max-h-[85vh] overflow-hidden'>
          <h2 className='text-lg font-semibold'>學習日誌</h2>
          {/* 導入文 */}
          <p className='mt-2 text-sm text-gray-700'>
            你剛才聽了根據自己作文改寫的日語句子，有沒有發現新的東西呢？
            <br />
            三天之後，你可能就忘記了。請為未來的自己留下筆記。
          </p>

          {/* 回答一覧：ここだけをスクロール。sentenceが多くても下のテキストエリアは見える */}
          <div className='mt-3 max-h-[40vh] overflow-auto rounded border p-3 text-sm'>
            {loading ? (
              <div className='h-5 w-1/3 animate-pulse rounded bg-gray-200' />
            ) : rows.length === 0 ? (
              <p className='text-gray-500'>資料がありません。</p>
            ) : (
              <ul className='space-y-2'>
                {rows
                  .sort((a, b) => a.seq - b.seq)
                  .map((r) => (
                    <li key={r.seq} className='rounded border p-2'>
                      <div className='font-medium'>
                        #{r.seq}　{r.content}
                      </div>
                      <div className='mt-1 text-gray-700'>
                        你的回答：{r.answer}
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          {/* 本文入力 */}
          <label className='mt-4 block text-sm font-medium'>日誌內容</label>
          <textarea
            className='mt-1 h-40 w-full resize-y rounded border p-2 text-sm'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={placeholder}
          />

          {/* フッターボタン：保存は本文が空なら無効 */}
          <div className='mt-4 flex justify-end'>
            <button
              className='rounded bg-black px-3 py-1.5 text-white disabled:opacity-40'
              onClick={save}
              disabled={!canSave}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }, [open, rows, body, loading, save, close]);

  return { openJournalModal, JournalModalElement };
}
