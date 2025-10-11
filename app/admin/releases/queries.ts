import { createClient } from '@/lib/supabase/server';
import { Assignment, ReleaseWithContext, UserCore } from '@/types/dictation';

export async function listUsers(): Promise<UserCore[]> {
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
): Promise<ReleaseWithContext[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('get_admin_releases_by_user', {
    p_user_id: userId,
  });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCollectionsByUser(
  userId: string
): Promise<Pick<Assignment, 'id' | 'title'>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('dictation_assignments')
    .select('id, title')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
