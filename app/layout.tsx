import { cn } from '@/lib/utils';
import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: '原田日本語教室',
  description: '原田日本語教室 — lang gym',
  openGraph: {
    title: '原田日本語教室',
    description: '原田日本語教室 — lang gym',
    url: 'https://dictation-eight.vercel.app/',
    siteName: '原田日本語教室',
    images: [
      {
        url: 'https://dictation-eight.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: '原田日本語教室',
      },
    ],
    locale: 'zh_Hant',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '原田日本語教室',
    description: '原田日本語教室 — lang gym',
    images: ['https://dictation-eight.vercel.app/og-image.png'],
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
