import { VOICES } from './voices';

export async function playTTS(
  text: string,
  options?: {
    languageCode?: string;
    voiceName?: string;
    speakingRate?: number;
    pitch?: number;
    volumeGainDb?: number;
  }
) {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      languageCode: options?.languageCode ?? 'ja-JP',
      voiceName:
        options?.voiceName ?? VOICES.premium['Neural2'].male['ja-JP-Neural2-C'],
      speakingRate: options?.speakingRate ?? 1.0,
      pitch: options?.pitch ?? 0.0,
      volumeGainDb: options?.volumeGainDb ?? 0.0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to get audio URL');
  }

  const arrayBuffer = await response.arrayBuffer();
  const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  await audio.play();
  return url;
}
