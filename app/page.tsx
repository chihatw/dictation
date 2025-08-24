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

  const { data: threads, error } = await supabase
    .from('chat_threads')
    .select('id, title, created_at, meta')
    .eq('uid', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching threads:', error);
  }

  return (
    <div className='bg-gray-200 h-screen flex flex-col'>
      <main className='p-6 space-y-4 max-w-lg mx-auto w-full bg-white rounded-lg shadow-md mt-10'>
        <h1 className='text-xl font-semibold'>Threads</h1>
        <ul className='space-y-2'>
          {threads?.map((t) => (
            <li key={t.id} className='rounded border p-3'>
              <div className='font-medium'>{t.title}</div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
