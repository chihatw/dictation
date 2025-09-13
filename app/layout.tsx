import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body className='min-h-dvh bg-gray-100 antialiased'>{children}</body>
    </html>
  );
}
