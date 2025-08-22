import { createTTSClient } from '@/utils/createTTSClient';

export interface TTSOptions {
  languageCode: string;
  voiceName: string;
  speakingRate: number;
  pitch: number;
  volumeGainDb: number;
}
// 受け取ったテキストをTTSクライアントを使って音声合成し、 Buffer を返す関数
export async function synthesizeText(
  text: string,
  { languageCode, voiceName, speakingRate, pitch, volumeGainDb }: TTSOptions
): Promise<Buffer> {
  const ttsClient = createTTSClient();

  const [response] = await ttsClient.synthesizeSpeech({
    input: { text: text.trim() },
    voice: {
      languageCode,
      name: voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate,
      pitch,
      volumeGainDb,
    },
  });

  if (!response.audioContent) {
    throw new Error('No audio content received from TTS API');
  }

  return Buffer.from(response.audioContent as string, 'base64');
}
