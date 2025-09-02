'use client';

import { supabase } from '@/lib/supabase/browser';
import { useEffect, useState } from 'react';

type Log = {
  id: string;
  created_at: string;
  answer: string | null;
  plays_count: number;
  listened_full_count: number;
  used_play_all: boolean;
  elapsed_ms_since_item_view: number;
  elapsed_ms_since_first_play: number;
  users: { display: string } | null;
  dictation_sentences: {
    seq: number;
    content: string;
    dictation_articles: { title: string } | null;
  } | null;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  // フィルタ入力
  const [userFilter, setUserFilter] = useState('');
  const [titleFilter, setTitleFilter] = useState('');

  const fetchLogs = async () => {
    let query = supabase
      .from('dictation_submission_logs')
      .select(
        `
        id,
        created_at,
        answer,
        plays_count,
        listened_full_count,
        used_play_all,
        elapsed_ms_since_item_view,
        elapsed_ms_since_first_play,
        users(display),
        dictation_sentences(
          seq,
          content,
          dictation_articles(title)
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(50);

    // フィルタ条件
    if (userFilter) {
      query = query.ilike('users.display', `%${userFilter}%`);
    }
    if (titleFilter) {
      query = query.ilike(
        'dictation_sentences.dictation_articles.title',
        `%${titleFilter}%`
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      setLogs(data as Log[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatSec = (ms: number) => Math.floor(ms / 1000);

  return (
    <div className='p-6'>
      <h1 className='text-xl font-bold mb-4'>ログ一覧</h1>

      {/* フィルタ入力フォーム */}
      <div className='mb-4 flex gap-4'>
        <input
          type='text'
          placeholder='ユーザー名で検索'
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className='border px-2 py-1 rounded'
        />
        <input
          type='text'
          placeholder='問題タイトルで検索'
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
          className='border px-2 py-1 rounded'
        />
        <button
          onClick={fetchLogs}
          className='px-3 py-1 bg-gray-800 text-white rounded'
        >
          フィルタ適用
        </button>
      </div>

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
                <th className='border p-2'>最後まで再生</th>
                <th className='border p-2'>経過時間（表示→送信）</th>
                <th className='border p-2'>経過時間（初回再生→送信）</th>
                <th className='border p-2'>作成日時</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className='border p-2'>{log.users?.display ?? '-'}</td>
                  <td className='border p-2'>
                    {log.dictation_sentences?.dictation_articles?.title ?? '-'}
                  </td>
                  <td className='border p-2'>
                    {log.dictation_sentences?.seq ?? '-'}
                  </td>
                  <td
                    className='border p-2 max-w-xs truncate'
                    title={log.dictation_sentences?.content ?? '-'}
                  >
                    {log.dictation_sentences?.content ?? '-'}
                  </td>
                  <td className='border p-2'>{log.answer}</td>
                  <td className='border p-2 text-center'>{log.plays_count}</td>
                  <td className='border p-2 text-center'>
                    {log.listened_full_count}
                  </td>
                  <td className='border p-2'>
                    {formatSec(log.elapsed_ms_since_item_view)} 秒
                  </td>
                  <td className='border p-2'>
                    {formatSec(log.elapsed_ms_since_first_play)} 秒
                  </td>
                  <td className='border p-2'>
                    {new Date(log.created_at).toLocaleString()}
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
