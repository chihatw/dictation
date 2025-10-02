import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import CollectionForm from '../_CollectionForm';
import { updateCollection } from '../actions';

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: users, error: ue }, { data: col, error: ce }] =
    await Promise.all([
      supabase
        .from('users')
        .select('uid, display')
        .order('created_at', { ascending: true }),
      supabase
        .from('dictation_article_collections')
        .select('id, title, user_id')
        .eq('id', id)
        .maybeSingle(),
    ]);

  if (ue) throw new Error(ue.message);
  if (ce) throw new Error(ce.message);
  if (!col) return notFound();

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-medium'>コレクション編集</h2>
      <CollectionForm
        users={users ?? []}
        defaultValues={{ id: col.id, title: col.title, user_id: col.user_id }}
        action={updateCollection}
        submitLabel='保存'
      />
    </div>
  );
}
