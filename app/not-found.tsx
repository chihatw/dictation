'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();

  return (
    <main className='min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4'>
      <p className='text-6xl font-bold text-gray-200'>404</p>
      <h1 className='text-xl font-semibold text-gray-700'>找不到此頁面</h1>
      <code className='text-sm bg-gray-100 text-gray-500 px-3 py-1 rounded-full'>
        {pathname}
      </code>
      <Link href='/' className='mt-4 text-sm text-gray-500 hover:underline'>
        返回首頁
      </Link>
    </main>
  );
}
