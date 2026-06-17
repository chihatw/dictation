import { cn } from '@/lib/utils';
import { Noto_Sans_TC } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://dictation-eight.vercel.app'),
  title: 'Lang Gym 日語私人教練',
  description: 'Lang Gym 日語私人教練｜學習日誌',
  openGraph: {
    title: 'Lang Gym 日語私人教練',
    description: 'Lang Gym 日語私人教練｜學習日誌',
    url: '/',
    siteName: 'Lang Gym 日語私人教練',
    images: ['https://dictation-eight.vercel.app/og-image.png'],
    locale: 'zh_TW ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lang Gym 日語私人教練',
    description: 'Lang Gym 日語私人教練｜學習日誌',
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
      <body className='min-h-dvh bg-gray-100 antialiased'>
        <NextTopLoader
          color='#0f172a'
          height={3}
          showSpinner={false}
          zIndex={9999}
          shadow={false}
        />
        {children}
      </body>
    </html>
  );
}
