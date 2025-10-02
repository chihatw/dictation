import { createClientAction } from '@/lib/supabase/server-action';
import CollectionForm from '../_CollectionForm';
import { createCollection } from '../actions';

export default async function NewCollectionPage() {
  const supabase = await createClientAction();
  const { data: users, error } = await supabase
    .from('users')
    .select('uid, display')
    .order('created_at', { ascending: true });
  if (error) throw new Error(error.message);

  return (
    <div className='space-y-4'>
      <h2 className='text-xl font-medium'>コレクション作成</h2>
      <CollectionForm
        users={users ?? []}
        action={createCollection}
        submitLabel='作成'
      />
    </div>
  );
}
