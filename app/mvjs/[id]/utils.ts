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
