import { createClientAction } from '@/lib/supabase/server-action';
import { createClient } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import { cache } from 'react';

type AuthContext<TSupabase> = {
  supabase: TSupabase;
  user: User;
  role: unknown;
};

function getRole(user: User) {
  return user.app_metadata?.role;
}

function assertUser<TSupabase>(
  supabase: TSupabase,
  user: User | null,
): AuthContext<TSupabase> {
  if (!user) {
    notFound();
  }

  return {
    supabase,
    user,
    role: getRole(user),
  };
}

export const requireUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return assertUser(supabase, user);
});

export const requireAdmin = cache(async () => {
  const auth = await requireUser();

  if (auth.role !== 'admin') {
    notFound();
  }

  return auth;
});

export async function requireUserAction() {
  const supabase = await createClientAction();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return assertUser(supabase, user);
}

export async function requireAdminAction() {
  const auth = await requireUserAction();

  if (auth.role !== 'admin') {
    notFound();
  }

  return auth;
}
