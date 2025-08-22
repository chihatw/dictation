import { playTTS } from '@/utils/playTTS';
import { useRef, useState } from 'react';

export function useTTS() {
  const audioCache = useRef<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = async (
    text: string,
    options?: {
      languageCode?: string;
      voiceName?: string;
      speakingRate?: number;
      pitch?: number;
      volumeGainDb?: number;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      // キャッシュ確認
      let url: string;

      if (audioCache.current.has(text)) {
        url = audioCache.current.get(text)!;
        const audio = new Audio(url);
        await audio.play();
      } else {
        url = await playTTS(text, options);
        audioCache.current.set(text, url);
      }

      return;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return { play, loading, error };
}
