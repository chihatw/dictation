import { Sprout, Ticket } from 'lucide-react';
import Link from 'next/link';

const linkClassName =
  'inline-flex size-10 items-center justify-center rounded-lg text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400';

export function AppHeader() {
  return (
    <header className='flex h-14 items-center justify-between'>
      <Link href='/' aria-label='首頁' className={linkClassName}>
        <Sprout className='size-6' aria-hidden='true' />
      </Link>

      <Link href='/payments' aria-label='課程費用' className={linkClassName}>
        <Ticket className='size-6' aria-hidden='true' />
      </Link>
    </header>
  );
}
