import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export function AssignmentHeader({ title }: { title: string }) {
  return (
    <div className='grid gap-4'>
      <div>
        <Link
          href='/'
          className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
        >
          <ChevronLeft className='h-4 w-4' /> 返回首頁
        </Link>
      </div>
      <h1 className='text-xl font-semibold'>{title}</h1>
    </div>
  );
}
