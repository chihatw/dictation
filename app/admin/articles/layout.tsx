export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='mx-auto max-w-3xl px-4 py-6'>
      <h1 className='mb-6 text-2xl font-semibold'>課題文章一覧</h1>
      {children}
    </div>
  );
}
