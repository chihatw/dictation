// hooks/useAudioPlayer.ts
'use client';

import { useRef, useState } from 'react';

export function useAudioPlayer() {
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playUrl = async (url: string) => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      if (currentAudio.current) {
        currentAudio.current.pause();
        currentAudio.current.currentTime = 0;
      }
      const audio = new Audio(url);
      currentAudio.current = audio;
      audio.addEventListener(
        'ended',
        () => {
          setIsPlaying(false);
          currentAudio.current = null;
        },
        { once: true }
      );
      await audio.play();
      setIsPlaying(true);
    } catch (e: any) {
      setError(e?.message ?? 'playUrl failed');
    } finally {
      setLoading(false);
    }
  };

  const stop = () => {
    if (currentAudio.current) {
      currentAudio.current.pause();
      currentAudio.current.currentTime = 0;
      currentAudio.current = null;
    }
    setIsPlaying(false);
  };

  return { playUrl, stop, loading, isPlaying, error };
}
