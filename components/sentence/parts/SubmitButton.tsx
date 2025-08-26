'use client';

import { Loader2, Send } from 'lucide-react';
import { ButtonHTMLAttributes, memo } from 'react';

export type SubmitButtonProps = {
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

function SubmitButtonBase({
  loading,
  disabled,
  onClick,
  ...rest
}: SubmitButtonProps) {
  return (
    <button
      {...rest}
      type='button'
      disabled={disabled || loading}
      onClick={onClick}
      className='inline-flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50'
      aria-busy={!!loading}
    >
      {loading ? (
        <>
          <Loader2 className='h-4 w-4 animate-spin' /> 正在送出… ⏳
          可能需要一些時間，請耐心等候
        </>
      ) : (
        <>
          <Send className='h-4 w-4' /> 送出
        </>
      )}
    </button>
  );
}

export const SubmitButton = memo(SubmitButtonBase);
