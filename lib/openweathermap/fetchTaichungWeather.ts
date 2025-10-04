const TAICHUNG = { lat: 24.1477, lon: 120.6736 }; // 台中

type Weather = {
  tempC?: number;
  desc?: string;
  main?: string; // Clear, Clouds, Rain, etc.
};

export async function fetchTaichungWeather(): Promise<Weather | null> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return null;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${TAICHUNG.lat}&lon=${TAICHUNG.lon}&appid=${key}&units=metric&lang=zh_tw`;
  const res = await fetch(url, { next: { revalidate: 600 } }); // 10分キャッシュ
  if (!res.ok) return null;
  const j = await res.json();
  return {
    tempC:
      typeof j?.main?.temp === 'number' ? Math.round(j.main.temp) : undefined,
    desc: j?.weather?.[0]?.description ?? undefined,
    main: j?.weather?.[0]?.main ?? undefined,
  };
}
