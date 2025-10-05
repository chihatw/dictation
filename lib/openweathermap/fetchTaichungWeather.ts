export type Weather = {
  tempC?: number;
  desc?: string;
  main?: string; // Clear, Clouds, Rain, etc.
};

const LOCATIONS = {
  YUNLIN: { lat: 23.7094, lon: 120.4314 },
  HYOGO: { lat: 34.6913, lon: 135.183 },
};

async function fetchWeatherByCoords(
  lat: number,
  lon: number
): Promise<Weather | null> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return null;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=zh_tw`;
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) return null;
  const j = await res.json();
  return {
    tempC:
      typeof j?.main?.temp === 'number' ? Math.round(j.main.temp) : undefined,
    desc: j?.weather?.[0]?.description ?? undefined,
    main: j?.weather?.[0]?.main ?? undefined,
  };
}

export async function fetchMultiWeather() {
  const [yunlin, hyogo] = await Promise.all([
    fetchWeatherByCoords(LOCATIONS.YUNLIN.lat, LOCATIONS.YUNLIN.lon),
    fetchWeatherByCoords(LOCATIONS.HYOGO.lat, LOCATIONS.HYOGO.lon),
  ]);
  return { yunlin, hyogo };
}
