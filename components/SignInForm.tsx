'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

const SignInForm = ({ next = '/' }: { next?: string }) => {
  const { signIn, loading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const canSubmit = useMemo(
    () => !loading && email.length > 0 && password.length > 0,
    [loading, email, password]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!canSubmit) return; // 二重送信ガード

      const ok = await signIn(email.trim(), password);
      if (ok) {
        router.replace(next); // 成功時は戻る履歴を汚さない
      }
    },
    [canSubmit, signIn, email, password, router, next]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto max-w-sm space-y-4 rounded border p-4'
      aria-busy={loading}
    >
      <div>
        <label htmlFor='email' className='mb-1 block'>
          Email
        </label>
        <input
          id='email'
          name='email'
          type='email'
          inputMode='email'
          autoComplete='email'
          spellCheck={false}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full rounded border px-2 py-1'
          required
          disabled={loading}
          aria-invalid={!!error}
        />
      </div>

      <div>
        <label htmlFor='password' className='mb-1 block'>
          Password
        </label>
        <input
          id='password'
          name='password'
          type='password'
          autoComplete='current-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='w-full rounded border px-2 py-1'
          required
          minLength={6}
          disabled={loading}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <div className='text-sm text-red-600' role='alert' aria-live='polite'>
          {error}
        </div>
      )}

      <button
        type='submit'
        className='w-full rounded bg-slate-600 py-2 text-white disabled:opacity-50'
        disabled={!canSubmit}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignInForm;
