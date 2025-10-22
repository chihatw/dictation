// app/admin/articles/page.tsx
import { createClient } from '@/lib/supabase/server';
import { ArticleView, Assignment } from '@/types/dictation';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ assignment_id?: string; user_id?: string }>;
};

export default async function Page(props: PageProps) {
  const sp = await props.searchParams;
  const { assignment_id: colId, user_id: userId } = sp;

  const supabase = await createClient();

  if (!colId) {
    return (
      <div className='space-y-6'>
        <h1 className='text-xl font-semibold'>課題文章一覧</h1>
        <p className='text-sm text-muted-foreground'>
          assignment_id が指定されていません。課題一覧から選択してください。
        </p>
        <Link
          href='/admin/assignments'
          className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
        >
          課題一覧へ
        </Link>
      </div>
    );
  }

  const { data: col, error: colErr } = await supabase
    .from('dictation_assignments')
    .select('id, title, due_at')
    .eq('id', colId)
    .maybeSingle<Pick<Assignment, 'id' | 'title' | 'due_at'>>();

  if (colErr) throw new Error(colErr.message);

  if (!col) {
    return (
      <div className='space-y-6'>
        <h1 className='text-xl font-semibold'>課題文章一覧</h1>
        <p className='text-sm text-red-600'>指定の課題が見つかりません。</p>
        <Link
          href='/admin/assignments'
          className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
        >
          課題一覧へ
        </Link>
      </div>
    );
  }

  // articles
  const { data: articlesRaw, error: artErr } = await supabase
    .from('dictation_article_journal_status_view')
    .select('article_id, subtitle, seq, journal_id, has_cloze_spans')
    .eq('assignment_id', col.id)
    .order('seq', { ascending: true });

  if (artErr) throw new Error(artErr.message);
  const articles: Pick<
    ArticleView,
    'article_id' | 'subtitle' | 'seq' | 'journal_id' | 'has_cloze_spans'
  >[] = Array.isArray(articlesRaw) ? articlesRaw : [];

  const dueAt = new Date(col.due_at!);

  return (
    <div className='space-y-6'>
      <div className='flex items-start gap-3'>
        <div>
          <h1 className='text-xl font-semibold'>
            <span className='mr-2'>{dueAt.toLocaleDateString()}</span>
            <span>{`${col.title}`}</span>
          </h1>
        </div>
        <div className='ml-auto flex items-center gap-2'>
          <Link
            href={`/admin/assignments?user_id=${userId}`}
            className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
          >
            ユーザー別課題一覧に戻る
          </Link>

          <Link
            href={`/admin/articles/new?assignment_id=${encodeURIComponent(
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
              <th className='px-2 py-1'>順</th>
              <th className='px-2 py-1'>サブタイトル</th>

              <th className='px-2 py-1'>操作</th>
            </tr>
          </thead>
          <tbody>
            {(articles ?? []).map((a) => (
              <tr key={a.article_id} className='border-t'>
                <td className='px-2 py-1'>{a.seq}</td>
                <td className='px-2 py-1'>
                  {a.subtitle} {a.has_cloze_spans ? '*' : ''}
                </td>
                <td className='px-2 py-1 space-x-2'>
                  <div className='flex gap-x-2 items-center'>
                    <Link
                      href={`/articles/${a.article_id}`}
                      className='rounded-md border px-2 py-1'
                    >
                      Article ページ
                    </Link>
                    {a.journal_id ? (
                      <Link
                        href={`/admin/journals/${a.journal_id}?assignment_id=${colId}&user_id=${userId}`}
                        className='rounded-md border px-2 py-1'
                      >
                        編輯填空題
                      </Link>
                    ) : (
                      <div className='ml-2 text-slate-400'>学習日誌なし</div>
                    )}
                  </div>
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
