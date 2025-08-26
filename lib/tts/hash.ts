// lib/tts/hash.ts
export type TtsKey = {
  text: string;
  voiceName: string;
  speakingRate: number;
  languageCode: string;
  provider: 'google'; // 使うものを全部含める（将来の差異で別物扱いにするため）
  version: number; // 破壊的変更時に上げる
};

export async function buildTtsHash(key: TtsKey) {
  const raw = JSON.stringify(key);
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(raw)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
