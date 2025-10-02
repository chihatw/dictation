// app/admin/articles/page.tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

type User = { uid: string; display: string };
type Collection = { id: string; title: string };
type Article = {
  id: string;
  subtitle: string;
  created_at: string;
  seq: number;
};

export default async function Page(props: PageProps) {
  const {
    /* unused */
  } = await props.params;
  const sp = await props.searchParams;
  const userId = typeof sp.user_id === 'string' ? sp.user_id : '';
  const colId = typeof sp.collection_id === 'string' ? sp.collection_id : '';

  const supabase = await createClient();

  // users
  const { data: usersRaw } = await supabase
    .from('users')
    .select('uid, display')
    .order('display', { ascending: true });
  const users: User[] = Array.isArray(usersRaw) ? usersRaw : [];

  // collections
  const { data: collectionsRaw } = userId
    ? await supabase
        .from('dictation_article_collections')
        .select('id, title')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
    : { data: null };
  const collections: Collection[] = Array.isArray(collectionsRaw)
    ? collectionsRaw
    : [];

  // colId の整合性
  const validColId = collections.some((c) => c.id === colId) ? colId : '';

  // articles
  const { data: articlesRaw } = validColId
    ? await supabase
        .from('dictation_articles')
        .select('id, subtitle, created_at, seq')
        .eq('collection_id', validColId)
        .order('seq', { ascending: true })
    : { data: null };
  const articles: Article[] = Array.isArray(articlesRaw) ? articlesRaw : [];

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>一覧</h1>

      <div className='flex flex-wrap gap-6'>
        {/* ユーザー選択 専用フォーム */}
        <form
          action='/admin/articles'
          method='get'
          className='flex items-end gap-3'
        >
          <div className='flex flex-col gap-2'>
            <Select name='user_id' defaultValue={userId || ''}>
              <SelectTrigger className='w-[360px]'>
                <SelectValue placeholder='ユーザーを選択' />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u.uid} value={u.uid}>
                    {u.display}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type='submit'
            className='inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white'
          >
            適用
          </button>
          <Link
            href='/admin/articles'
            className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
          >
            クリア
          </Link>
        </form>

        {/* コレクション選択 専用フォーム */}
        <form
          action='/admin/articles'
          method='get'
          className='flex items-end gap-3'
        >
          {/* user_id を維持するため hidden */}
          <input type='hidden' name='user_id' value={userId} />
          <div className='flex flex-col gap-2'>
            <Select
              name='collection_id'
              defaultValue={validColId || ''}
              disabled={!userId}
            >
              <SelectTrigger className='w-[360px]'>
                <SelectValue placeholder='コレクションを選択' />
              </SelectTrigger>
              <SelectContent>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type='submit'
            disabled={!userId}
            className='inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white disabled:opacity-50'
          >
            適用
          </button>
          <Link
            href={
              userId
                ? `/admin/articles?user_id=${encodeURIComponent(userId)}`
                : '/admin/articles'
            }
            className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
          >
            クリア
          </Link>
        </form>

        {/* 新規作成は別ボタン */}
        <div className='ml-auto flex items-end'>
          <Link
            href='/admin/articles/new'
            className='inline-flex items-center rounded-md bg-black px-3 py-2 text-sm text-white'
          >
            新規作成
          </Link>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='px-2 py-1'>seq</th>
              <th className='px-2 py-1'>subtitle</th>
              <th className='px-2 py-1'>created_at</th>
              <th className='px-2 py-1'>操作</th>
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.id} className='border-t'>
                <td className='px-2 py-1'>{a.seq}</td>
                <td className='px-2 py-1'>{a.subtitle}</td>
                <td className='px-2 py-1'>
                  {new Date(a.created_at).toLocaleString('ja-JP')}
                </td>
                <td className='px-2 py-1'>
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className='rounded-md border px-2 py-1'
                  >
                    編集
                  </Link>
                </td>
              </tr>
            ))}
            {(articles?.length ?? 0) === 0 && (
              <tr>
                <td className='px-2 py-6 text-gray-500' colSpan={4}>
                  該当データなし
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
