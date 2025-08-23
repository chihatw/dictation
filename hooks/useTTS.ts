import { TTSOptions } from '@/libs/tts/types';
import { playTTS } from '@/utils/playTTS';
import { useRef, useState } from 'react';

export function useTTS() {
  const audioCache = useRef<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = async (text: string, options?: Partial<TTSOptions>) => {
    setLoading(true);
    setError(null);
    try {
      let url: string;
      // キャッシュがあれば、再利用
      if (audioCache.current.has(text)) {
        url = audioCache.current.get(text)!;
        const audio = new Audio(url);
        await audio.play();
        return;
      }

      // キャッシュがなければ 音声合成
      url = await playTTS(text, options);

      // キャッシュに保存
      audioCache.current.set(text, url);

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
