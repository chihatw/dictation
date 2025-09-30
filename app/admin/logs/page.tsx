'use client';

import { supabase } from '@/lib/supabase/browser';
import { useEffect, useState } from 'react';

type Row = {
  id: string;
  user_id: string;
  sentence_id: string;
  plays_count: number;
  elapsed_ms_since_item_view: number;
  elapsed_ms_since_first_play: number;
  self_assessed_comprehension: number;
  answer: string | null;
  created_at: string;
  display: string; // users.display
  content: string; // dictation_sentences.content
  seq: number; // dictation_sentences.seq
  article_id: string; // dictation_sentences.article_id
  title: string; // dictation_articles.subtitle
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
        plays_count,
        elapsed_ms_since_item_view,
        elapsed_ms_since_first_play,
        self_assessed_comprehension,
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

  // 表示用マップ
  const compMap: Record<number, string> = {
    1: '😕 聽不懂',
    2: '🙂 大致懂',
    3: '😀 幾乎全懂',
    4: '🗣️✍️ 可運用',
  };

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>ログ一覧（最新文ごと）</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='table-fixed w-full text-xs leading-tight tabular-nums'>
            <colgroup>
              <col className='w-24' /> {/* ユーザー名 */}
              <col className='w-32' /> {/* 問題タイトル */}
              <col className='w-10' /> {/* 行番号 */}
              <col className='w-64' /> {/* 文本文 */}
              <col className='w-64' /> {/* 回答 */}
              <col className='w-12' /> {/* 再生回数 */}
              <col className='w-20' /> {/* 経過A */}
              <col className='w-20' /> {/* 経過B */}
              <col className='w-16' /> {/* 自己評価 */}
              <col className='w-36' /> {/* 作成日時 */}
            </colgroup>

            <thead>
              <tr className='bg-gray-50'>
                {[
                  'ユーザー名',
                  '問題タイトル',
                  '行',
                  '文本文',
                  '回答',
                  '再生',
                  '再生→送信',
                  '表示→送信',
                  '自己評価',
                  '作成日時',
                ].map((h) => (
                  <th
                    key={h}
                    className='border p-1 font-medium text-[11px] whitespace-nowrap'
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className='align-top'>
                  <td className='border p-1'>{r.display}</td>
                  <td className='border p-1'>{r.title}</td>
                  <td className='border p-1 text-center'>{r.seq}</td>

                  <td className='border p-1 max-w-64 whitespace-normal break-words'>
                    {r.content}
                  </td>
                  <td className='border p-1 max-w-64 whitespace-normal break-words'>
                    {r.answer ?? ''}
                  </td>

                  <td className='border p-1 text-center whitespace-nowrap'>
                    {r.plays_count}
                  </td>
                  <td className='border p-1 whitespace-nowrap'>
                    {formatMinSec(r.elapsed_ms_since_first_play)}
                  </td>
                  <td className='border p-1 whitespace-nowrap'>
                    {formatMinSec(r.elapsed_ms_since_item_view)}
                  </td>
                  <td className='border p-1 text-center whitespace-nowrap'>
                    {compMap[r.self_assessed_comprehension] ??
                      `等級 ${r.self_assessed_comprehension}`}
                  </td>
                  <td className='border p-1 whitespace-nowrap'>
                    {formatJST(r.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
