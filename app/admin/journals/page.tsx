import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

const Page = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('dictation_journals')
    .select()
    .order('created_at', { ascending: false });

  if (error) console.log(error.message);

  if (!data) return <div>no data</div>;

  return (
    <div className='max-w-2xl mx-auto py-10 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl flex gap-2 items-center'>
        <span>【Temp】學習日誌リスト</span>
        <span className='font-extralight text-black/60 text-lg'>
          link to /cloze/[id]
        </span>
      </h1>
      {data.map((row) => {
        const date = new Date(row.created_at);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        const h = date.getHours();
        const min = date.getMinutes();
        const s = date.getSeconds();
        return (
          <div
            key={row.id}
            className='grid grid-cols-[auto_1fr_auto] gap-x-2 items-center'
          >
            <div className='whitespace-nowrap w-40 flex items-center'>
              <span className='font-bold mr-2'>
                {[
                  y,
                  m.toString().padStart(2, '0'),
                  d.toString().padStart(2, '0'),
                ].join('/')}
              </span>
              <span className='font-extralight text-xs'>
                {[h, min, s]
                  .map((i) => i.toString().padStart(2, '0'))
                  .join(':')}
              </span>
            </div>

            <div className='truncate underline hover:cursor-pointer hover:font-bold'>
              <Link href={`/admin/journals/${row.id}`}>{row.body}</Link>
            </div>
            <div className='w-8 text-right font-extralight text-sm'>
              {row.body.length}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Page;
