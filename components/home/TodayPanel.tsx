import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  Snowflake,
  Sun,
  Wind,
} from 'lucide-react';

export type Weather = {
  tempC?: number;
  desc?: string;
  main?: string;
};

function WeatherIcon({ main }: { main?: string }) {
  const cls = 'h-16 w-16 mb-[-10px]';
  switch (main) {
    case 'Clear':
      return <Sun className={cls} />;
    case 'Clouds':
      return <Cloud className={cls} />;
    case 'Rain':
      return <CloudRain className={cls} />;
    case 'Drizzle':
      return <CloudDrizzle className={cls} />;
    case 'Thunderstorm':
      return <CloudLightning className={cls} />;
    case 'Snow':
      return <Snowflake className={cls} />;
    case 'Mist':
    case 'Haze':
    case 'Fog':
    case 'Smoke':
      return <CloudFog className={cls} />;
    default:
      return <Wind className={cls} />;
  }
}

export default function TodayPanel({
  todayStr,
  wx,
}: {
  todayStr: string;
  wx: Weather | null;
}) {
  return (
    <section className='rounded-xl border p-5 bg-white'>
      <div className='text-sm text-gray-500'>今天</div>
      <div className='md:flex justify-between'>
        <div className='text-2xl font-semibold'>{todayStr}</div>
        <div className='flex items-end gap-2 text-sm text-gray-700'>
          <WeatherIcon main={wx?.main} />
          <div className='flex items-end'>
            <div className='text-5xl font-bold'>
              {wx?.tempC != null ? `${wx.tempC}` : '—'}
            </div>
            <div className='text-2xl font-bold'>
              {wx?.tempC != null ? '°C' : null}
            </div>
          </div>
          <div className='truncate max-w-[11rem] pb-1 font-extralight'>
            {`台中${wx?.desc ?? ''}`}
          </div>
        </div>
      </div>
    </section>
  );
}
