// app/admin/releases/[id]/page.tsx
import { supabaseAdmin } from '@/lib/supabase/admin';
import Link from 'next/link';
import { addItem, removeItem } from '../actions';

type Params = { params: Promise<{ id: string }> };

export default async function Page(props: Params) {
  const params = await props.params;
  const releaseId = params.id;

  // リリース本体（uid取得用）
  const { data: release, error: relErr } = await supabaseAdmin
    .from('dictation_releases')
    .select('id, user_id, created_at, published_at, due_at')
    .eq('id', releaseId)
    .single();
  if (relErr) throw relErr;
  if (!release) throw new Error('release not found');

  // 登録済み記事（pos昇順）
  const { data: rawItems, error: itemsErr } = await supabaseAdmin
    .from('dictation_release_items')
    .select('id, article_id, pos, dictation_articles(id, subtitle, created_at)')
    .eq('release_id', releaseId)
    .order('pos', { ascending: true });
  if (itemsErr) throw itemsErr;
  const items = rawItems ?? [];

  // 追加候補：同一uidの最新10件だけ取得（除外はUI側で実施）
  const { data: rawCandidates, error: candErr } = await supabaseAdmin
    .from('dictation_articles')
    .select('id, subtitle, created_at')
    .eq('uid', release.user_id)
    .order('created_at', { ascending: false })
    .limit(10);
  if (candErr) throw candErr;

  // items に含まれるものは UI 側で非表示
  const itemIdSet = new Set(items.map((i) => i.article_id));
  const candidates = (rawCandidates ?? []).filter(
    (a) => !!a && !itemIdSet.has(a.id)
  );

  // Server Action wrappers（FormData → 既存SA呼び出し）
  async function onAdd(formData: FormData) {
    'use server';
    const articleId = String(formData.get('articleId') || '');
    if (!articleId) throw new Error('articleId required');
    await addItem({ releaseId, articleId });
  }

  async function onRemove(formData: FormData) {
    'use server';
    const itemId = String(formData.get('itemId') || '');
    if (!itemId) throw new Error('itemId required');
    await removeItem(itemId);
  }

  return (
    <div className='p-6 space-y-8'>
      {/* ヘッダ */}
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>リリース詳細</h1>
        <Link href='/admin/releases' className='underline'>
          一覧へ
        </Link>
      </div>

      {/* メタ情報 */}
      <section className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='border rounded p-4'>
          <div className='text-sm text-gray-500'>Release ID</div>
          <div className='font-mono'>{release.id}</div>
        </div>
        <div className='border rounded p-4'>
          <div className='text-sm text-gray-500'>UID</div>
          <div className='font-mono'>{release.user_id}</div>
        </div>
        <div className='border rounded p-4'>
          <div className='text-sm text-gray-500'>作成</div>
          <div>
            {new Date(release.created_at).toLocaleString('ja-JP', {
              timeZone: 'Asia/Tokyo',
            })}
          </div>
        </div>
        <div className='border rounded p-4'>
          <div className='text-sm text-gray-500'>公開</div>
          <div>
            {release.published_at
              ? new Date(release.published_at).toLocaleString('ja-JP', {
                  timeZone: 'Asia/Tokyo',
                })
              : '未公開'}
          </div>
        </div>
        <div className='border rounded p-4 md:col-span-2'>
          <div className='text-sm text-gray-500'>提出期限</div>
          <div>
            {release.due_at
              ? new Date(release.due_at).toLocaleString('ja-JP', {
                  timeZone: 'Asia/Tokyo',
                })
              : '—'}
          </div>
        </div>
      </section>

      {/* 登録済み記事一覧（削除） */}
      <section className='space-y-3'>
        <h2 className='text-lg font-semibold'>記事一覧</h2>
        <div className='border rounded'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left p-2'>pos</th>
                <th className='text-left p-2'>article_id</th>
                <th className='text-left p-2'>タイトル</th>
                <th className='text-left p-2'>記事作成</th>
                <th className='text-left p-2'>操作</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((it) => (
                <tr key={it.id} className='border-t'>
                  <td className='p-2'>{it.pos}</td>
                  <td className='p-2 font-mono'>{it.article_id}</td>
                  <td className='p-2'>
                    {it.dictation_articles?.subtitle ?? ''}
                  </td>
                  <td className='p-2'>
                    {it.dictation_articles?.created_at
                      ? new Date(
                          it.dictation_articles.created_at
                        ).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
                      : '—'}
                  </td>
                  <td className='p-2'>
                    <form action={onRemove}>
                      <input type='hidden' name='itemId' value={it.id} />
                      <button
                        type='submit'
                        className='px-3 py-1 rounded border'
                      >
                        削除
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!items || items.length === 0) && (
                <tr>
                  <td colSpan={5} className='p-4 text-gray-500'>
                    記事はありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 追加候補（同一uid、未登録、10件） */}
      <section className='space-y-3'>
        <h2 className='text-lg font-semibold'>記事追加（候補）</h2>
        <div className='border rounded'>
          <table className='w-full text-sm'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left p-2'>article_id</th>
                <th className='text-left p-2'>タイトル</th>
                <th className='text-left p-2'>記事作成</th>
                <th className='text-left p-2'>操作</th>
              </tr>
            </thead>
            <tbody>
              {candidates?.map((a) => (
                <tr key={a.id} className='border-t'>
                  <td className='p-2 font-mono'>{a.id}</td>
                  <td className='p-2'>{a.subtitle}</td>
                  <td className='p-2'>
                    {a.created_at
                      ? new Date(a.created_at).toLocaleString('ja-JP', {
                          timeZone: 'Asia/Tokyo',
                        })
                      : '—'}
                  </td>
                  <td className='p-2'>
                    <form action={onAdd}>
                      <input type='hidden' name='articleId' value={a.id} />
                      <button
                        type='submit'
                        className='px-3 py-1 rounded bg-blue-600 text-white'
                      >
                        追加
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!candidates || candidates.length === 0) && (
                <tr>
                  <td colSpan={4} className='p-4 text-gray-500'>
                    候補はありません
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className='text-xs text-gray-500'>
          追加は pos 最大の次番号で登録。並び替えは削除＋追加で行う。
        </p>
      </section>
    </div>
  );
}
