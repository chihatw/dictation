import SignInForm from '@/components/SignInForm';

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
    <main className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Sign In</h1>
        <SignInForm next={next} />
      </div>
    </main>
  );
};

export default SigninPage;
