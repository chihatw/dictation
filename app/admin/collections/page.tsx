import { createClientAction } from '@/lib/supabase/server-action';
import Link from 'next/link';
import { deleteCollection } from './actions';

type User = { uid: string; display: string };
type Collection = {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
};

export default async function CollectionsPage() {
  const supabase = await createClientAction();

  // collections
  const { data: cols, error: ce } = await supabase
    .from('dictation_article_collections')
    .select('id, created_at, user_id, title')
    .order('created_at', { ascending: false });
  if (ce) throw new Error(ce.message);

  // users（5件想定をそのまま取得）
  const { data: users, error: ue } = await supabase
    .from('users')
    .select('uid, display')
    .order('created_at', { ascending: true });
  if (ue) throw new Error(ue.message);

  const nameByUid = new Map(users.map((u: User) => [u.uid, u.display]));

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-medium'>一覧</h2>
        <Link
          href='/admin/collections/new'
          className='rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50'
        >
          新規作成
        </Link>
      </div>

      <div className='divide-y rounded-md border'>
        {(cols as Collection[]).map((col) => (
          <div
            key={col.id}
            className='flex flex-wrap items-center justify-between gap-3 px-3 py-2'
          >
            <div>
              <div className='font-medium'>{col.title}</div>
              <div className='text-xs text-gray-500'>
                {nameByUid.get(col.user_id) ?? col.user_id} ・{' '}
                {new Date(col.created_at).toLocaleString()}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Link
                href={`/admin/collections/${col.id}`}
                className='rounded-md border px-2 py-1 text-sm hover:bg-gray-50'
              >
                編集
              </Link>

              <form action={deleteCollection}>
                <input type='hidden' name='id' value={col.id} />
                <button
                  type='submit'
                  className='rounded-md border border-red-300 px-2 py-1 text-sm text-red-600 hover:bg-red-50'
                >
                  削除
                </button>
              </form>
            </div>
          </div>
        ))}
        {cols?.length === 0 && (
          <div className='px-3 py-6 text-sm text-gray-500'>データなし</div>
        )}
      </div>
    </div>
  );
}
