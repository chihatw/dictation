import { Weather } from '@/types/dictation';
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

export const WeatherPanel = ({
  wx,
  label,
}: {
  wx: Weather | null;
  label: string;
}) => {
  return (
    <div className='flex items-end gap-2 text-sm text-gray-700 '>
      <WeatherIcon main={wx?.main} />
      <div className='grid'>
        <Temperature tempC={wx?.tempC} />
        <div className='truncate font-extralight  text-center text-xs '>
          {`${label}: ${wx?.desc ?? ''}`}
        </div>
      </div>
    </div>
  );
};

function WeatherIcon({ main }: { main?: string }) {
  const cls = 'h-16 w-16 leading-none ';
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

export const Temperature = ({ tempC }: { tempC: number | undefined }) => {
  return (
    <div className='flex items-end '>
      <div className='text-5xl font-bold leading-none'>
        {tempC != null ? `${tempC}` : '—'}
      </div>
      <div className='text-xl font-bold leading-none mb-1'>
        {tempC != null ? '°C' : null}
      </div>
    </div>
  );
};
