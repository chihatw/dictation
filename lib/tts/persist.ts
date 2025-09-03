// lib/tts/persist.ts
import { createClientAction } from '@/lib/supabase/server-action';

import { synthesizeText } from '.';
import { buildTtsHash, TtsKey } from './hash';

export async function synthesizeToStorage(input: TtsKey) {
  const hash = await buildTtsHash(input);
  const path = `tts/${hash}.mp3`;

  const supabase = await createClientAction();

  // 直接アップロードを試み、失敗したら既存とみなす（並行リクエストの競合を吸収）
  const audioBuffer = await synthesizeText(input.text, {
    languageCode: input.languageCode,
    voiceName: input.voiceName,
    speakingRate: input.speakingRate,
    pitch: 0,
    volumeGainDb: 0,
  });

  await supabase.storage
    .from('tts-audio')
    .upload(path, audioBuffer, { upsert: false, contentType: 'audio/mpeg' });

  // 既存あり（競合）は成功扱い
  return { path, hash };
}
