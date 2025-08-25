'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SigninPage = () => {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Sign In</h1>
        <SignInForm />
      </div>
    </main>
  );
};

export default SigninPage;

function SignInForm() {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await signIn(email, password);
    if (ok) {
      console.log('サインイン成功');
      router.push('/'); // サインイン成功時はトップへ遷移
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='max-w-sm mx-auto p-4 border rounded space-y-4'
    >
      <div>
        <label htmlFor='email' className='block mb-1'>
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full border px-2 py-1 rounded'
          required
        />
      </div>
      <div>
        <label htmlFor='password' className='block mb-1'>
          Password
        </label>
        <input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full border px-2 py-1 rounded'
          required
        />
      </div>
      {error && <div className='text-red-500 text-sm'>{error}</div>}
      <button
        type='submit'
        className='w-full bg-slate-500 text-white py-2 rounded disabled:opacity-50'
        disabled={loading}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
