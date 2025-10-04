function stripWeekPrefix(w?: string | null) {
  return w ? w.replace(/^週/, '') : '';
}

const TAIPEI_TZ = 'Asia/Taipei';

export function formatTodayTW(d = new Date()) {
  const fmt = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TAIPEI_TZ,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
  }).formatToParts(d);
  const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? '';
  const w = stripWeekPrefix(get('weekday'));
  return `${get('year')}年${get('month')}月${get('day')}日(${w})`;
}

export function formatDueTW(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  const fmt = new Intl.DateTimeFormat('zh-TW', {
    timeZone: TAIPEI_TZ,
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    hour12: false,
    weekday: 'short',
  }).formatToParts(d);
  const get = (t: string) => fmt.find((p) => p.type === t)?.value ?? '';
  const w = stripWeekPrefix(get('weekday'));
  return `${get('month')}月${get('day')}日(${w}) ${get('hour')}時`;
}
