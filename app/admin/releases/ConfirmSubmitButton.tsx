'use client';

export function ConfirmSubmitButton({
  children,
  message = 'このリリースを削除します。よろしいですか？',
  className,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
}) {
  return (
    <button
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
