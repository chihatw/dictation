import { TTSOptions } from '@/lib/tts/types';
import { playTTS } from '@/utils/playTTS';
import { useRef, useState } from 'react';

const makeCacheKey = (text: string, options?: Partial<TTSOptions>) => {
  const voice = options?.voiceName ?? '';
  const rate = options?.speakingRate ?? 1; // デフォルト値も入れて安定化
  return `${text}::${voice}::${rate}`;
};

export function useTTS() {
  const audioCache = useRef<Map<string, string>>(new Map());
  const currentAudio = useRef<HTMLAudioElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playUrl = async (url: string) => {
    setLoading(true);
    setError(null);
    try {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }
      const audio = new Audio(url);
      currentAudio.current = audio;
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        currentAudio.current = null;
      });
      await audio.play();
      setIsPlaying(true);
    } catch (e: any) {
      setError(e?.message ?? 'playUrl failed');
    } finally {
      setLoading(false);
    }
  };

  const play = async (text: string, options?: Partial<TTSOptions>) => {
    setLoading(true);
    setError(null);

    const key = makeCacheKey(text, options);
    try {
      let url: string;
      // キャッシュがあれば、再利用
      if (audioCache.current.has(key)) {
        url = audioCache.current.get(key)!;
      } else {
        // キャッシュがなければ 音声合成
        url = await playTTS(text, options);

        // キャッシュに保存
        audioCache.current.set(key, url);
      }

      // すでに再生中なら止めてから新しい audio を再生
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }

      const audio = new Audio(url);
      currentAudio.current = audio;

      // 再生終了時にフラグを戻す
      const onEnded = () => {
        setIsPlaying(false);
        currentAudio.current = null;
      };
      audio.addEventListener('ended', onEnded);

      await audio.play();
      setIsPlaying(true);
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

  const stop = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0; // 頭に戻す
      currentAudio.current = null;
    }
    setIsPlaying(false);
  };

  return { play, playUrl, stop, loading, error, isPlaying };
}
