// components/home/UserHome.tsx
import { HomeJournalsContainer } from '@/components/home/journals/HomeJournalsContainer';
import { HomeMVJContainer } from '@/components/home/mvj/HomeMVJContainer';
import { NextClassContainer } from '@/components/home/nextClass/NextClassContainer';
import { HomePowerIndexContainer } from '@/components/home/powerIndex/HomePowerIndexContainer';
import TodayPanelContainer from '@/components/home/todayPanel/TodayPanelContainer';

export function UserHome({ userId }: { userId: string }) {
  return (
    <div className='mx-auto min-h-screen w-full max-w-2xl px-4 pb-10'>
      {/* <AppHeader /> */}
      <div className='h-14' />
      <main className='space-y-6'>
        <TodayPanelContainer />
        <NextClassContainer userId={userId} />
        <HomeMVJContainer userId={userId} />
        <HomePowerIndexContainer userId={userId} />
        <HomeJournalsContainer userId={userId} />
      </main>
    </div>
  );
}
