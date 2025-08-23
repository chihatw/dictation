import { GOOGLE_DEFAULT_TTS_OPTIONS } from '@/libs/tts/constants';
import { TTSOptions } from '@/libs/tts/types';

export async function playTTS(text: string, options?: Partial<TTSOptions>) {
  const provider = process.env.TTS_PROVIDER ?? 'google';

  let defaultOptions: TTSOptions;

  switch (provider) {
    // 他のプロバイダーのデフォルトオプションをここに追加
    default:
      defaultOptions = GOOGLE_DEFAULT_TTS_OPTIONS;
  }

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      languageCode: options?.languageCode ?? defaultOptions.languageCode,
      voiceName: options?.voiceName ?? defaultOptions.voiceName,
      speakingRate: options?.speakingRate ?? defaultOptions.speakingRate,
      pitch: options?.pitch ?? defaultOptions.pitch,
      volumeGainDb: options?.volumeGainDb ?? defaultOptions.volumeGainDb,
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
