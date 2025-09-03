// utils/revalidate.ts (server-only)
'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateAdminReleases() {
  revalidatePath('/admin/releases');
}

export async function revalidateReleaseDetail(id: string) {
  revalidatePath(`/admin/releases/${id}`);
}

export async function revalidateReleaseAll(id: string) {
  await Promise.all([revalidateAdminReleases(), revalidateReleaseDetail(id)]);
}
