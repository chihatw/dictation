// ユーザー毎に内容が変わるため動的
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default async function Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const { data, error } = await supabase.rpc('list_journals_for_me');

  if (error) throw new Error(error.message);

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>學習日誌</h1>

        <ul className='space-y-4'>
          {data?.map((j) => (
            <li key={j.id} className='rounded border p-3 bg-slate-50'>
              <Link href={`/articles/${j.article_id}`} className='block'>
                <div className='flex items-center hover:underline gap-x-1'>
                  <time className='font-bold '>
                    {new Date(j.created_at).toLocaleString('ja-JP', {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                    })}
                  </time>
                  <time className='font-light text-slate-500'>
                    {new Date(j.created_at).toLocaleString('ja-JP', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </time>

                  <LinkIcon className='w-3 h-3 text-slate-500' />
                </div>
              </Link>
              <div className='mt-1 text-sm text-gray-700'>
                {j.body.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
