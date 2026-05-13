import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

export function LandingPage() {
  return (
    <>
      <Script src='https://tally.so/widgets/embed.js' strategy='lazyOnload' />

      <main className='min-h-screen max-w-md mx-auto'>
        <section className='px-6 pt-8 pb-16 space-y-8'>
          <header className='space-y-4'>
            <h1 className='font-bold leading-tight'>
              <span className='text-4xl'>Lang Gym</span>{' '}
              <span className='text-2xl'>日語私人教練 🏋</span>
            </h1>

            <p className='text-base text-neutral-700'>
              一對一線上日語課。
              <br />
              重點是會話練習、表達訓練與實際溝通。
            </p>
          </header>

          <Link
            href='/signin'
            className='flex w-full items-center justify-center gap-1 rounded-lg bg-black py-2.5 text-white'
          >
            <span>會員登入</span>
            <ArrowRight className='h-5 w-5' />
          </Link>

          <section className='rounded-xl border border-neutral-200 bg-white p-4 space-y-3'>
            <div>
              <h2 className='font-bold text-lg'>線上一對一日語課程</h2>
              <p className='mt-1 text-sm text-neutral-700'>
                使用 Google Meet 進行線上課程。
              </p>
            </div>

            <div>
              <p className='text-sm text-neutral-500'>課程費用</p>
              <p className='text-2xl font-bold'>60 分鐘 / 600 TWD</p>
            </div>
          </section>

          <section>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold'>課程諮詢</h2>

              <p className='text-sm leading-relaxed text-neutral-500'>
                送出後，我們會於 24 小時內以 Email 與您聯絡。
                <br />
                請留意 Gmail 信件與垃圾郵件匣。
              </p>

              <p className='text-xs text-neutral-400'>
                課程諮詢表單使用 Tally 提供。
              </p>
            </div>

            <iframe
              data-tally-src='https://tally.so/embed/0Q10JP?alignLeft=1&transparentBackground=1&dynamicHeight=1&hideTitle=1'
              loading='lazy'
              width='100%'
              height='500'
              title='Lang Gym Course Inquiry Form'
            />
          </section>

          <footer className='border-t border-neutral-200 pt-4 text-xs leading-relaxed text-neutral-500'>
            <p>課程採預約制。付款方式與上課時間將於課前確認。</p>
            <p>如需取消或改期，請提前聯絡。</p>

            <div className='pt-8'>
              <Link
                href='/tokusho'
                className='underline underline-offset-2 hover:text-neutral-700'
              >
                特定商取引法に基づく表記
              </Link>
            </div>
          </footer>
        </section>
      </main>
    </>
  );
}
