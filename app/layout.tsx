import { cn } from '@/lib/utils';
import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-noto-tc',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='zh-Hant' className={cn('h-full', `${notoSansTC.variable}`)}>
      <body className='min-h-dvh bg-gray-100 antialiased'>{children}</body>
    </html>
  );
}
