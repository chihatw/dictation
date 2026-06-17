'use client';

import { supabase } from '@/lib/supabase/browser';
import { SubmissionWithContext, UserCore } from '@/types/dictation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const COLS = [
  'w-16',
  'w-10',
  'w-10',
  'w-64',
  'w-64',
  'w-12',
  'w-20',
  'w-20',
  'w-16',
  'w-36',
];

export default function LogsPage() {
  const [rows, setRows] = useState<SubmissionWithContext[]>([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserCore[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>(''); // 未選択 = 空

  // ユーザー一覧取得（表示名用）
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display')
        .order('created_at', { ascending: true });
      if (error) {
        console.error(error);
        setUsers([]);
      } else {
        setUsers((data ?? []) as UserCore[]);
      }
    })();
  }, []);

  // 選択ユーザーのログ取得
  useEffect(() => {
    if (!selectedUser) {
      setRows([]);
      return;
    }
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_submission_latest', {
        p_limit: 40,
        p_offset: 0,
        p_user_id: selectedUser,
      });
      if (error) {
        console.error(error);
        setRows([]);
      } else {
        setRows((data ?? []) as SubmissionWithContext[]);
      }
      setLoading(false);
    })();
  }, [selectedUser]);

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

  const compMap: Record<number, string> = {
    1: '😕 聽不懂',
    2: '🙂 大致懂',
    3: '😀 幾乎全懂',
    4: '🗣️✍️ 可運用',
  };

  return (
    <div className='p-6 space-y-4'>
      <Link
        href='/admin'
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-4'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>管理者ページ</span>
      </Link>
      <h1 className='text-xl font-bold'>ログ一覧</h1>

      {/* User Select */}
      <div className='flex items-center gap-3'>
        <label htmlFor='user' className='text-sm font-medium'>
          User
        </label>
        <select
          id='user'
          className='border rounded px-2 py-1 text-sm'
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value=''>— 選択してください —</option>
          {users.map((u) => (
            <option key={u.user_id} value={u.user_id}>
              {u.display}
            </option>
          ))}
        </select>
        {selectedUser && (
          <button
            type='button'
            className='text-xs underline'
            onClick={() => setSelectedUser('')}
          >
            クリア
          </button>
        )}
      </div>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='table-fixed w-full text-xs leading-tight tabular-nums'>
            <colgroup>
              {COLS.map((c, index) => (
                <col key={index} className={c} />
              ))}
            </colgroup>
            <thead>
              <tr className='bg-gray-50'>
                {[
                  '課題',
                  '',
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
              {rows.length === 0 ? (
                <tr>
                  <td className='p-3 text-center text-gray-500' colSpan={10}>
                    ユーザー未選択、またはデータなし
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className='align-top'>
                    <td className='border p-1'>{r.title}</td>
                    <td className='border p-1'>{r.subtitle}</td>
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
