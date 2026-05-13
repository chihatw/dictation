// app/signin/page.tsx
import SignInForm from '@/components/SignInForm';
import Link from 'next/link';

type SearchParamsPromise = Promise<
  Record<string, string | string[] | undefined>
>;

const SigninPage = async ({
  searchParams,
}: {
  searchParams?: SearchParamsPromise;
}) => {
  const sp = (await searchParams) ?? {};

  const raw =
    typeof sp.next === 'string'
      ? sp.next
      : Array.isArray(sp.next)
        ? sp.next[0]
        : '/';

  // open-redirect 対策：先頭が "/" の相対パスだけ許可
  const next = typeof raw === 'string' && raw.startsWith('/') ? raw : '/';

  return (
    <main className='flex min-h-screen items-center justify-center px-4'>
      <div className='w-full max-w-md'>
        <h1 className='mb-6 text-center text-2xl font-bold'>會員登入</h1>

        <SignInForm next={next} />

        <div className='mt-6 text-center'>
          <Link
            href='/'
            className='text-sm text-slate-400 hover:text-slate-600'
          >
            返回首頁
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SigninPage;
