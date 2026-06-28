// app/admin/users/actions.ts
'use server';

import { requireAdminAction } from '@/lib/auth/guards';
import { setRole } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function grantAdmin(uid: string) {
  await requireAdminAction();
  await setRole(uid, 'admin');
  revalidatePath('/admin/users'); // or router.refresh()
}

export async function revokeAdmin(uid: string) {
  await requireAdminAction();
  await setRole(uid, null);
  revalidatePath('/admin/users');
}
