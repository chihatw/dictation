import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminHomePage() {
  const links = [
    { href: '/admin/collections', label: 'Article Collections' },
    { href: '/admin/logs', label: 'Logs' },
    { href: '/admin/releases', label: 'Releases' },
    { href: '/admin/users', label: 'Users' },
  ];

  return (
    <div className='max-w-md mx-auto p-6 space-y-4 mt-10'>
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className='block hover:bg-gray-50 rounded-xl border transition'
        >
          <Card>
            <CardContent className='flex justify-between items-center'>
              <span className='font-medium'>{item.label}</span>
              <ChevronRight className='h-4 w-4 text-gray-500' />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
