import { cn } from '@/lib/utils';
import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://dictation-eight.vercel.app'),
  title: '原田日本語教室',
  description: '原田日本語教室｜聽力練習｜學習日誌',
  openGraph: {
    title: '原田日本語教室',
    description: '原田日本語教室｜聽力練習｜學習日誌',
    url: '/',
    siteName: '原田日本語教室',
    images: ['/og-image.png'],
    locale: 'zh_TW ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '原田日本語教室',
    description: '原田日本語教室｜聽力練習｜學習日誌',
    images: ['/og-image.png'],
  },
};

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
    <html lang='zh-Hant' className={cn('h-full', notoSansTC.className)}>
      <body className='min-h-dvh bg-gray-100 antialiased'>{children}</body>
    </html>
  );
}
