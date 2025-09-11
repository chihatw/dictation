'use client';

import { supabase } from '@/lib/supabase/browser';
import { useEffect, useState } from 'react';

type Row = {
  id: string;
  user_id: string;
  sentence_id: string;
  listened_full_count: number;
  elapsed_ms_since_item_view: number;
  elapsed_ms_since_first_play: number;
  answer: string | null;
  created_at: string;
  display: string; // users.display
  content: string; // dictation_sentences.content
  seq: number; // dictation_sentences.seq
  article_id: string; // dictation_sentences.article_id
  title: string; // dictation_articles.title
};

export default function LogsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRows = async () => {
    const { data, error } = await supabase
      .from('dictation_submission_latest_view')
      .select(
        `
        id,
        user_id,
        sentence_id,
        listened_full_count,
        elapsed_ms_since_item_view,
        elapsed_ms_since_first_play,
        answer,
        created_at,
        display,
        content,
        seq,
        article_id,
        title
        `
      )
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
    } else {
      setRows((data ?? []) as Row[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const formatMinSec = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}分${s.toString().padStart(2, '0')}秒`;
  };

  const formatJST = (iso: string) =>
    new Date(iso).toLocaleString('ja-JP', {
      timeZone: 'Asia/Tokyo',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>ログ一覧（最新文ごと）</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='table-auto border-collapse border border-gray-300 text-sm w-full'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='border p-2'>ユーザー名</th>
                <th className='border p-2'>問題タイトル</th>
                <th className='border p-2'>行番号</th>
                <th className='border p-2'>文本文</th>
                <th className='border p-2'>回答</th>
                <th className='border p-2'>再生回数</th>
                <th className='border p-2'>経過時間（初回再生→送信）</th>
                <th className='border p-2'>経過時間（表示→送信）</th>
                <th className='border p-2'>作成日時</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className='border p-2'>{r.display}</td>
                  <td className='border p-2'>{r.title}</td>
                  <td className='border p-2 text-center'>{r.seq}</td>
                  <td
                    className='border p-2 max-w-xs truncate'
                    title={r.content}
                  >
                    {r.content}
                  </td>
                  <td className='border p-2'>{r.answer ?? ''}</td>
                  <td className='border p-2 text-center'>
                    {r.listened_full_count}
                  </td>
                  <td className='border p-2'>
                    {formatMinSec(r.elapsed_ms_since_first_play)}
                  </td>
                  <td className='border p-2'>
                    {formatMinSec(r.elapsed_ms_since_item_view)}
                  </td>
                  <td className='border p-2'>{formatJST(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
