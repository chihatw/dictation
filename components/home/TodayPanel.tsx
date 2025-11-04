import { Weather } from '@/types/dictation';
import { formatTodayTW } from '@/utils/home/formatDate';
import { WeatherPanel } from './WeatherPanel';

export default function TodayPanel({
  yunlin,
  hyogo,
}: {
  yunlin: Weather | null;
  hyogo: Weather | null;
}) {
  const todayStr = formatTodayTW();
  return (
    <section className='rounded-xl border p-5 bg-white'>
      {/* <div className='text-sm text-gray-500'>今天</div> */}
      <div className='flex flex-wrap md:flex-nowrap justify-between gap-x-4 gap-y-2'>
        <div className='text-2xl font-semibold'>{todayStr}</div>
        <div className='flex gap-2'>
          <WeatherPanel wx={yunlin} label='雲林' />
          <div className='border-l border' />
          <WeatherPanel wx={hyogo} label='兵庫' />
        </div>
      </div>
    </section>
  );
}
