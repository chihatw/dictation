import { TTSOptions } from '@/libs/tts/types';

export async function playTTS(text: string, options?: Partial<TTSOptions>) {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // JSON.stringify は 値が undefined のプロパティを JSON に含めない
    body: JSON.stringify({
      text,
      languageCode: options?.languageCode,
      voiceName: options?.voiceName,
      speakingRate: options?.speakingRate,
      pitch: options?.pitch,
      volumeGainDb: options?.volumeGainDb,
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
