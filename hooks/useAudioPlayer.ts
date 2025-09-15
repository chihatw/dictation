// hooks/useAudioPlayer.ts
'use client';

import { useEffect, useRef, useState } from 'react';

export type PlayerAPI = {
  playUrl: (u: string) => Promise<void>;
  pause: () => void;
  seek: (t: number) => void;
  prime: (u: string) => void;
  isPlaying: boolean;
  loading: boolean;
  duration: number;
  currentTime: number;
};

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // 秒
  const [currentTime, setCurrentTime] = useState(0); // 秒
  const [error, setError] = useState<string | null>(null);

  // 内部ヘルパ
  const ensure = (url?: string) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current!;
    if (url && src !== url) {
      a.src = url;
      setSrc(url);
    }
    return a;
  };

  // メタデータと進捗
  useEffect(() => {
    const a = ensure();
    const onLoaded = () =>
      setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    const onTime = () => setCurrentTime(a.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      a.currentTime = 0; // 仕様：最後まで再生で 00:00 に戻す
      setCurrentTime(0);
    };
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnded);
    };
  }, []);

  const playUrl = async (url: string) => {
    if (!url) return;
    const a = ensure(url);
    setLoading(true);
    setError(null);
    try {
      await a.play();
      setIsPlaying(true);
    } catch (e: any) {
      setError(e?.message ?? 'play failed');
    } finally {
      setLoading(false);
    }
  };

  const pause = () => {
    const a = ensure();
    a.pause();
    setIsPlaying(false);
  };

  const resume = async () => {
    const a = ensure();
    setLoading(true);
    try {
      await a.play();
      setIsPlaying(true);
    } finally {
      setLoading(false);
    }
  };

  const stop = () => {
    const a = ensure();
    a.pause();
    a.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const seek = (timeSec: number) => {
    const a = ensure();
    const t = Math.max(0, Math.min(timeSec, duration || a.duration || 0));
    a.currentTime = t;
    setCurrentTime(t);
  };

  const prime = (url: string) => {
    const a = ensure();
    if (src === url) return; // 既に同じなら何もしない
    a.preload = 'metadata';
    a.src = url; // ← a.load() は呼ばない
    setSrc(url);
  };

  return {
    // 状態
    loading,
    isPlaying,
    duration,
    currentTime,
    error,
    // 操作
    playUrl,
    pause,
    resume,
    stop,
    seek,
    prime,
  };
}
