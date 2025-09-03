// utils/jstLocalToUtcIso.ts
import { Temporal } from '@js-temporal/polyfill';

export function jstLocalToUtcIso(local: string) {
  // local: '2025-09-03T14:30'
  const z = Temporal.ZonedDateTime.from(`${local}:00[Asia/Tokyo]`);
  return z.withTimeZone('UTC').toInstant().toString(); // ISO UTC
}
