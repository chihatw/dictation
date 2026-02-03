import { fetchMultiWeather } from '@/lib/openweathermap/fetchTaichungWeather';
import TodayPanel from './TodayPanel';

export default async function TodayPanelContainer() {
  try {
    const { yunlin, hyogo } = await fetchMultiWeather();
    return <TodayPanel yunlin={yunlin} hyogo={hyogo} />;
  } catch {
    // 天気は失敗してもホームを成立させる
    return <TodayPanel yunlin={null} hyogo={null} />;
  }
}
