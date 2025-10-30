export const fmtDate = (iso: Date) =>
  iso.toLocaleDateString('zh-TW', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'narrow',
    timeZone: 'Asia/Taipei',
  });

export const fmtTime = (iso: Date) =>
  iso.toLocaleTimeString('ja-JP', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Taipei',
  });

export const toLabel = (body: string) => {
  const first = (body.split('\n')[0] || '').trim();
  return first.length > 10 ? first.slice(0, 10) + '…' : first || '（無標題）';
};

export function extractPathFromPublicUrl(url: string, bucket: string) {
  // 例: https://xxx.supabase.co/storage/v1/object/public/dictation-mvj/UID/file.jpg
  // → UID/file.jpg を返す
  const marker = `/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return url.slice(i + marker.length);
}
