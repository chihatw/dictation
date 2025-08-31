// components/TTS/UrlPlayButton.tsx
'use client';

import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { BasePlayButton } from './BasePlayButton';

type Props = {
  audioUrl: string;
  variant?: 'solid' | 'outline';
  size?: 'md' | 'sm';
  className?: string;
  labels?: {
    idle?: string;
    loading?: string;
    stop?: string;
    aria?: string;
  };
  onPlayStart?: () => void;
};

export const UrlPlayButton = ({ audioUrl, onPlayStart, ...rest }: Props) => {
  const { playUrl, stop, loading, isPlaying } = useAudioPlayer();
  return (
    <BasePlayButton
      {...rest}
      loading={loading}
      isPlaying={isPlaying}
      onPlay={() => playUrl(audioUrl)}
      onStop={stop}
      onPlayStart={onPlayStart}
      disabled={!audioUrl}
    />
  );
};
