// app/admin/articles/page.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

type Collection = { id: string; title: string };
type Article = {
  id: string;
  subtitle: string;
  created_at: string;
  seq: number;
};

export default async function Page(props: PageProps) {
  await props.params; // 未使用でも await
  const sp = await props.searchParams;
  const colId = typeof sp.collection_id === 'string' ? sp.collection_id : '';

  const supabase = await createClient();

  if (!colId) {
    return (
      <div className='space-y-6'>
        <h1 className='text-xl font-semibold'>記事一覧</h1>
        <p className='text-sm text-muted-foreground'>
          collection_id
          が指定されていません。コレクション一覧から選択してください。
        </p>
        <Link
          href='/admin/collections'
          className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
        >
          コレクション一覧へ
        </Link>
      </div>
    );
  }

  // collection
  const { data: col, error: colErr } = await supabase
    .from('dictation_article_collections')
    .select('id, title')
    .eq('id', colId)
    .maybeSingle<Collection>();

  if (colErr) throw new Error(colErr.message);

  if (!col) {
    return (
      <div className='space-y-6'>
        <h1 className='text-xl font-semibold'>記事一覧</h1>
        <p className='text-sm text-red-600'>
          指定のコレクションが見つかりません。
        </p>
        <Link
          href='/admin/collections'
          className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
        >
          コレクション一覧へ
        </Link>
      </div>
    );
  }

  // articles
  const { data: articlesRaw, error: artErr } = await supabase
    .from('dictation_articles')
    .select('id, subtitle, created_at, seq')
    .eq('collection_id', col.id)
    .order('seq', { ascending: true });

  if (artErr) throw new Error(artErr.message);
  const articles: Article[] = Array.isArray(articlesRaw) ? articlesRaw : [];

  return (
    <div className='space-y-6'>
      <div className='flex items-start gap-3'>
        <div>
          <h1 className='text-xl font-semibold'>{`${col.title}`}</h1>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          {/* 追加: 戻るボタン */}
          <Link
            href='/admin/collections'
            className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
          >
            コレクション一覧に戻る
          </Link>

          <Link
            href={`/admin/articles/new?collection_id=${encodeURIComponent(
              col.id
            )}`}
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
                <td className='px-2 py-1'>
                  <Link
                    href={`/articles/${a.id}`}
                    className='underline hover:no-underline cursor-pointer'
                  >
                    {a.subtitle}
                  </Link>
                </td>
                <td className='px-2 py-1'>
                  {new Date(a.created_at).toLocaleString('ja-JP')}
                </td>
                <td className='px-2 py-1 space-x-2'>
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className='rounded-md border px-2 py-1'
                  >
                    subtitle編集
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
