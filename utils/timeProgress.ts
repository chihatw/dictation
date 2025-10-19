import { fromZonedTime, toZonedTime } from 'date-fns-tz';

const TZ = 'Asia/Taipei';

// due_at の「当日 0:00（TZ）」を UTC に変換
export function dueDayStartUtc(dueAtISO: string, tz = TZ): Date {
  const dueZoned = toZonedTime(new Date(dueAtISO), tz);
  const midnightLocal = new Date(
    dueZoned.getFullYear(),
    dueZoned.getMonth(),
    dueZoned.getDate(), // 00:00
    0,
    0,
    0,
    0
  );
  return fromZonedTime(midnightLocal, tz);
}

// 5%刻みで丸め。
export function timeProgress5pct(
  startAtISO: string | null | undefined,
  endAtISO: string | null | undefined,
  now: Date = new Date()
): number {
  if (!startAtISO || !endAtISO) return 0;
  const start = new Date(startAtISO).getTime();
  const end = new Date(endAtISO).getTime();
  const t = now.getTime();
  if (!isFinite(start) || !isFinite(end) || end <= start) return 0;
  if (t <= start) return 0;
  if (t >= end) return 100;
  const raw = ((t - start) / (end - start)) * 100;
  const snapped = 5 * Math.round(raw / 5);
  return Math.max(0, Math.min(100, snapped));
}
