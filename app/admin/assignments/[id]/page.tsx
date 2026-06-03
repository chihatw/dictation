import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, FileMusic, Folder } from 'lucide-react';
import Link from 'next/link';
import { JournalLockToggle } from './JournalLockToggle';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<void>;
}) {
  const { id } = await params;

  if (!id) throw new Error('id is required');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_articles')
    .select(
      `
      id,
      seq,
      subtitle,
      dictation_assignments(
        title,profiles(display),
        dictation_lessons(due_at)
      ),
      dictation_journals(
        id,
        locked,
        cloze_spans
      )
    `,
    )
    .eq('assignment_id', id)
    .order('seq');

  if (error) throw new Error(error.message);

  const articles = data?.map((article) => ({
    id: article.id,
    due_at: article.dictation_assignments?.dictation_lessons?.due_at,
    title: article.dictation_assignments?.title,
    display: article.dictation_assignments?.profiles?.display,
    subtitle: article.subtitle,
    seq: article.seq,
    journal_id: article.dictation_journals?.id || null,
    journal_locked: article.dictation_journals?.locked || false,
    has_cloze_spans:
      Array.isArray(article.dictation_journals?.cloze_spans) &&
      article.dictation_journals?.cloze_spans.length > 0,
  }));
  const article = articles[0];
  const _dueAt = article.due_at;
  const display = article.display;
  const title = article.title;

  if (!_dueAt) throw new Error('Due date not found');
  if (!display) throw new Error('Profile display not found');
  if (!title) throw new Error('Title not found');

  const dueAt = new Date(_dueAt);

  return (
    <div className='mx-auto max-w-xl px-4 py-6'>
      <Link
        href='/admin/lessons'
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <span>レッスン一覧</span>
      </Link>
      <h1 className='text-2xl font-semibold flex items-center gap-2 mb-2'>
        <Folder />
        <div className='flex items-center gap-2'>{`${display} ${title}`}</div>
      </h1>
      <div className='mb-4'>
        {dueAt.toLocaleString('ja-JP', {
          month: 'long',
          day: '2-digit',
          weekday: 'short',
          hour: '2-digit',
          timeZone: 'Asia/Tokyo',
        })}
      </div>
      <div className='mb-6'>
        <Link
          href={`/admin/assignments/${id}/new`}
          className='bg-black rounded-md text-sm text-white hover:cursor-pointer px-3 py-2'
        >
          <span>ディクテーション原稿作成</span>
        </Link>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='text-left'>
              <th className='px-2 py-1'>順</th>
              <th className='px-2 py-1'>サブタイトル</th>
              <th className='px-2 py-1'></th>
              <th className='px-2 py-1'>操作</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className='border-t'>
                <td>{a.seq}</td>
                <td className='px-2 py-1 flex items-center gap-1'>
                  <Link
                    href={`/articles/${a.id}`}
                    className='underline underline-offset-2 flex items-center gap-1.5 h-6'
                  >
                    {a.subtitle}
                  </Link>
                  <span>{a.has_cloze_spans ? '*' : ''}</span>
                </td>
                <td>
                  <Link
                    href={`/admin/articles/${a.id}`}
                    className='underline underline-offset-2 flex items-center gap-1.5 h-6'
                    title='音声チェック'
                  >
                    <FileMusic className='h-4 w-4' />
                  </Link>
                </td>
                <td className='px-2 py-1 space-x-2 '>
                  <div className='flex gap-x-2 items-center'>
                    <JournalLockToggle
                      journalId={a.journal_id}
                      initialLocked={a.journal_locked}
                      assignment_id={id}
                    />
                    {a.journal_id ? (
                      <Link
                        href={`/admin/journals/${a.journal_id}`}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
