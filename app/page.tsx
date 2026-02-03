// 動的レンダリング
export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server';

import { HomeClozeContainer } from '@/components/home/cloze/HomeClozeContainer';
import { HomeJournalsContainer } from '@/components/home/journals/HomeJournalsContainer';
import { HomeMVJContainer } from '@/components/home/mvj/HomeMVJContainer';
import { NextClassContainer } from '@/components/home/nextClass/NextClassContainer';
import { HomePowerIndexContainer } from '@/components/home/powerIndex/HomePowerIndexContainer';
import TodayPanelContainer from '@/components/home/todayPanel/TodayPanelContainer';

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('unauthorized');

  return (
    <div className='min-h-screen p-6'>
      <main className='mx-auto max-w-2xl space-y-6'>
        <TodayPanelContainer />
        <NextClassContainer userId={user.id} />
        <HomeMVJContainer userId={user.id} />
        <HomePowerIndexContainer userId={user.id} />
        <HomeClozeContainer userId={user.id} />
        <HomeJournalsContainer userId={user.id} />
      </main>
    </div>
  );
}
