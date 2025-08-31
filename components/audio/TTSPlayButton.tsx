// components/TTS/TTSPlayButton.tsx
'use client';

import { useTTS } from '@/hooks/useTTS';
import { BasePlayButton } from './BasePlayButton';

type Props = {
  text: string;
  voiceName: string;
  speakingRate: number;
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

export const TTSPlayButton = ({
  text,
  voiceName,
  speakingRate,
  onPlayStart,
  ...rest
}: Props) => {
  const { play, stop, loading, isPlaying } = useTTS();
  return (
    <BasePlayButton
      {...rest}
      loading={loading}
      isPlaying={isPlaying}
      onPlay={() => play(text, { voiceName, speakingRate })}
      onStop={stop}
      onPlayStart={onPlayStart}
      disabled={!text}
    />
  );
};
