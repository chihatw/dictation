export function remainDaysHours(iso?: string | null) {
  if (!iso) return null;
  const now = Date.now();
  const tgt = new Date(iso).getTime();
  const ms = Math.max(0, tgt - now);
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  return { days, hours };
}
