// components/home/UserHome.tsx
import { HomeClozeContainer } from '@/components/home/cloze/HomeClozeContainer';
import { HomeJournalsContainer } from '@/components/home/journals/HomeJournalsContainer';
import { HomeMVJContainer } from '@/components/home/mvj/HomeMVJContainer';
import { NextClassContainer } from '@/components/home/nextClass/NextClassContainer';
import { HomePowerIndexContainer } from '@/components/home/powerIndex/HomePowerIndexContainer';
import TodayPanelContainer from '@/components/home/todayPanel/TodayPanelContainer';

export function UserHome({ userId }: { userId: string }) {
  return (
    <div className='min-h-screen p-6'>
      <main className='mx-auto max-w-2xl space-y-6'>
        <TodayPanelContainer />
        <NextClassContainer userId={userId} />
        <HomeMVJContainer userId={userId} />
        <HomePowerIndexContainer userId={userId} />
        <HomeClozeContainer userId={userId} />
        <HomeJournalsContainer userId={userId} />
      </main>
    </div>
  );
}
