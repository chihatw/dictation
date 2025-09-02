// lib/supabase/admin.ts (server-only)
import { createClient } from '@supabase/supabase-js';
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
);

// server-only（service_role 必須）
export async function setRole(uid: string, role: 'admin' | null) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(uid, {
    app_metadata: { role }, // 付与は "admin"、剥奪は null
  });
  if (error) throw error;
}
