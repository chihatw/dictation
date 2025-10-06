import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminHomePage() {
  const links = [
    { href: '/admin/collections', label: '課題一覧' },
    { href: '/admin/releases', label: '公開管理' },
    { href: '/admin/logs', label: 'ログ一覧' },
    { href: '/admin/users', label: '管理者設定' },
  ];

  return (
    <div className='max-w-md mx-auto p-6 space-y-2 mt-10'>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className='block hover:bg-gray-50 rounded-xl border transition py-4 px-6 bg-white/80'
        >
          <div className='flex justify-between items-center'>
            <span className='font-medium'>{item.label}</span>
            <ChevronRight className='h-4 w-4 text-gray-500' />
          </div>
        </Link>
      ))}
    </div>
  );
}
