import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (!user || userErr) {
    redirect('/signin');
  }

  const { data: articles, error } = await supabase
    .from('dictation_articles')
    .select('id, title, created_at')
    .eq('uid', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching articles:', error);
  }

  return (
    <div className='h-screen flex flex-col'>
      <main className='p-6 space-y-4 max-w-lg mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>聽力練習</h1>
        <ul className='space-y-2'>
          {articles?.map((t) => (
            <li key={t.id} className='rounded border p-3'>
              <div className='font-medium'>{t.title}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
