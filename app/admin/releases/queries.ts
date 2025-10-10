import { createClient } from '@/lib/supabase/server';
import { UserInput } from '@/types/dictation';

export type AdminCollection = { id: string; title: string };
export type AdminReleaseRow = {
  id: string;
  user_id: string;
  collection_id: string;
  due_at: string;
  published_at: string | null;
  created_at: string;
  user: { display: string };
  collection: { title: string };
};

type AdminReleaseRowRPC = {
  id: string;
  user_id: string;
  collection_id: string;
  due_at: string;
  published_at: string | null;
  created_at: string;
  user_display: string;
  collection_title: string;
};

export async function listUsers(): Promise<UserInput[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('users')
    .select('uid, display')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listReleasesByUser(
  userId: string
): Promise<AdminReleaseRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_admin_releases_by_user', {
    p_user_id: userId,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: AdminReleaseRowRPC) => ({
    id: r.id,
    user_id: r.user_id,
    collection_id: r.collection_id,
    due_at: r.due_at,
    published_at: r.published_at,
    created_at: r.created_at,
    user: { display: r.user_display },
    collection: { title: r.collection_title },
  }));
}

export async function listCollectionsByUser(
  userId: string
): Promise<AdminCollection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_article_collections')
    .select('id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
