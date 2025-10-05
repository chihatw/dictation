// app/collections/[id]/page.tsx
export const dynamic = 'force-dynamic';

import Journal from '@/components/journal/Journal';
import { Tags } from '@/components/tag/Tags';
import { createClient } from '@/lib/supabase/server';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Row = {
  id: string;
  subtitle: string;
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
        <div className='grid gap-4'>
          <div>
            <Link
              href='/'
              className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
            >
              <ChevronLeft className='h-4 w-4' /> 返回首頁
            </Link>
          </div>
          <h1 className='text-xl font-semibold'>主題: {col.title}</h1>
        </div>

        {items.length === 0 ? (
          <div className='rounded border p-4 text-sm text-gray-600'>
            まだ記事がありません。
          </div>
        ) : (
          <ul className='space-y-2'>
            {items.map((t) => (
              <li key={t.id} className='rounded border p-3 '>
                <Link href={`/articles/${t.id}`} className='block'>
                  <div className='flex items-center hover:underline'>
                    <div className='flex-1 truncate font-medium'>
                      {t.subtitle}
                    </div>
                    <ChevronRight className='h-4 w-4 shrink-0' />
                  </div>
                </Link>

                {t.tags.length > 0 && (
                  <div className='mt-1 '>
                    <Tags items={t.tags} />
                  </div>
                )}

                {t.journal_body && t.journal_created_at && (
                  <div className='mt-2 '>
                    <Journal
                      body={t.journal_body}
                      created_at={t.journal_created_at}
                    />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
