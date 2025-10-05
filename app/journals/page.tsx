// ユーザー毎に内容が変わるため動的
export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Vote } from './Vote';

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  const { data, error } = await supabase.rpc('list_journals_for_me'); // rating_score を返すよう更新
  if (error) throw new Error(error.message);

  return (
    <div className='min-h-screen'>
      <main className='p-6 space-y-4 max-w-2xl mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold mb-3'>向過去的自己說聲謝謝</h1>

        <div className='text-sm text-slate-700 space-y-0'>
          <p>
            <span className='font-extrabold'>過去的你</span>
            在忙碌之中把握每一點空檔學習，
            <span className='font-extrabold'>
              為了今天的你，留下這本學習日誌
            </span>
            。
          </p>
          <p>
            如果覺得這些記錄<span className='font-extrabold'>有幫助</span>，
            <span className='font-bold'>請按「👍Good」</span>
            向過去的自己<span className='font-extrabold'>說聲謝謝</span>。
          </p>
          <p>
            若你覺得<span className='font-extrabold'>「這在寫什麼？」</span>或
            <span className='font-extrabold'>「這樣的筆記完全幫不上忙」</span>，
            <span className='font-extrabold'>請按「👎Bad」</span>
            提醒過去的自己<span className='font-extrabold'>需要改進</span>。
          </p>
          <p>
            <span className='font-extrabold'>
              給自己的感謝，或對自己的督促，都是讓你持續成長的力量
            </span>
            。
          </p>
          <p className='pt-2 text-xs  font-extralight'>
            「👍 Good」和「👎 Bad」都可以按很多次，想按幾次都沒問題喔。
          </p>
        </div>

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
                  <time className='font-light text-slate-500 text-sm'>
                    {new Date(j.created_at).toLocaleString('ja-JP', {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </time>
                  <LinkIcon className='w-3 h-3 text-slate-500' />
                </div>
              </Link>

              <div className='mt-1 text-sm text-gray-700'>
                {j.body.split('\n').map((line: string, i: number) => (
                  <div key={i}>{line}</div>
                ))}
              </div>

              <Vote
                id={j.id}
                initialScore={j.rating_score}
                createdAt={j.created_at}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
