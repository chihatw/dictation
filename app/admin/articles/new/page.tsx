// app/admin/articles/new/page.tsx
import { createClient } from '@/lib/supabase/server';
import { ArticleCreateForm } from '../_components/ArticleCreateForm';

type PageProps = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function Page(props: PageProps) {
  await props.params; // 未使用でも await しておく
  await props.searchParams;

  const supabase = await createClient();
  const [{ data: users }, { data: collections }] = await Promise.all([
    supabase
      .from('users')
      .select('uid, display')
      .order('display', { ascending: true }),
    supabase
      .from('dictation_article_collections')
      .select('id, title, user_id')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div className='space-y-6'>
      <h1 className='text-xl font-semibold'>article 新規作成</h1>
      <ArticleCreateForm users={users ?? []} collections={collections ?? []} />
    </div>
  );
}
