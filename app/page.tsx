// 動的レンダリング
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';

import { UserHome } from '@/components/home/UserHome';
import { LandingPage } from '@/components/landing/LandingPage';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LandingPage />;
  }

  return <UserHome userId={user.id} />;
}
