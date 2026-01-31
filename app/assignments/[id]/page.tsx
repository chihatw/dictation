// app/assignments/[id]/page.tsx
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { ArticleWithTagsAndJournal } from '@/types/dictation';
import { notFound } from 'next/navigation';
import { AssignmentEmptyState } from './components/assignemtEmptyState';
import { AssignmentArticleRow } from './components/assignmentArticleRow';
import { AssignmentHeader } from './components/assignmentHeader';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 課題存在確認（任意）
  const { data: col } = await supabase
    .from('dictation_assignments')
    .select('id, title')
    .eq('id', id)
    .maybeSingle();

  if (!col) return notFound();

  const { data, error } = await supabase.rpc('get_assignment_article_tags', {
    p_assignment_id: id,
  });
  if (error) throw new Error(error.message);

  const items = (data ?? []) as ArticleWithTagsAndJournal[];

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <AssignmentHeader title={col.title} />

        {items.length === 0 ? (
          <AssignmentEmptyState />
        ) : (
          <ul className='space-y-2'>
            {items.map((t) => (
              <AssignmentArticleRow key={t.id} t={t} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
