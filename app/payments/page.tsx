export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { Check, TicketCheck } from 'lucide-react';
import { redirect } from 'next/navigation';

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(iso));
}

function formatFee(fee: number) {
  return new Intl.NumberFormat('ja-JP').format(fee);
}

export default async function PaymentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/signin');

  const { data, error } = await supabase
    .from('dictation_tickets')
    .select(
      `
        id,
        duration,
        fee,
        paid,
        dictation_lessons!inner (
          due_at,
          dictation_assignments!inner (
            user_id
          )
        )
      `,
    )
    .eq('dictation_lessons.dictation_assignments.user_id', user.id)
    .order('dictation_lessons(due_at)', { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);

  return (
    <main className='mx-auto w-full max-w-3xl px-4 py-10'>
      <section className='rounded-lg border bg-white p-6 shadow-sm'>
        <h1 className='text-2xl font-semibold'>課程費用</h1>

        {data.length === 0 ? null : (
          <div className='mt-6 overflow-x-auto'>
            <div className='text-xl font-semibold mb-6 py-2 flex justify-center items-end'>
              <div className='pr-2 flex items-center gap-x-2'>
                <TicketCheck className='h-8 w-8 -mb-1' />
                待結算總額
              </div>
              <div>
                NT$<span className='text-6xl font-extrabold pl-2'>{0}</span>
              </div>
            </div>
            <table className='w-full text-left text-sm'>
              <tbody className='divide-y'>
                {data.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className='whitespace-nowrap px-3 py-3'>
                      {ticket.paid ? (
                        <span className='flex items-center gap-x-2'>
                          <Check /> 已結算
                        </span>
                      ) : (
                        <span>待結算</span>
                      )}
                    </td>
                    <td className='whitespace-nowrap px-3 py-3'>
                      {formatDateTime(ticket.dictation_lessons.due_at)}
                    </td>
                    <td className='whitespace-nowrap px-3 py-3'>
                      {ticket.duration}分鐘課程
                    </td>
                    <td className='whitespace-nowrap px-3 py-3'>
                      NT${formatFee(ticket.fee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
