// app/collections/[id]/page.tsx
export const dynamic = 'force-dynamic';

import Journal from '@/components/journal/Journal';
import { Tags } from '@/components/tag/Tags';
import { createClient } from '@/lib/supabase/server';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Row = {
  id: string;
  title: string;
  created_at: string;
  seq: number;
  tags: string[];
  journal_body: string | null;
  journal_created_at: string | null;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // コレクション存在確認（任意）
  const { data: col } = await supabase
    .from('dictation_article_collections')
    .select('id, title')
    .eq('id', id)
    .maybeSingle();
  if (!col) return notFound();

  const { data, error } = await supabase.rpc('get_collection_article_tags', {
    p_collection_id: id,
  });
  if (error) throw new Error(error.message);

  const items = (data ?? []) as Row[];

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>{col.title}</h1>

        {items.length === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            まだ記事がありません。
          </div>
        ) : (
          <ul className='space-y-2'>
            {items.map((t) => (
              <li key={t.id} className='rounded border p-3 hover:bg-gray-50'>
                <Link href={`/articles/${t.id}`} className='block'>
                  <div className='flex items-center'>
                    <div className='flex-1 truncate font-medium'>{t.title}</div>
                    <ChevronRight className='h-4 w-4 shrink-0' />
                  </div>

                  {t.tags.length > 0 && <Tags items={t.tags} />}

                  {t.journal_body && t.journal_created_at && (
                    <Journal
                      body={t.journal_body}
                      created_at={t.journal_created_at}
                    />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
