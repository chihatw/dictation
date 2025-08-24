import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { GOOGLE_VOICES } from './constants';
import { TTSOptions } from './types';

function createGoogleTTSClient(): TextToSpeechClient {
  try {
    return new TextToSpeechClient({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    });
  } catch (error) {
    console.error('Failed to initialize Google Cloud client:', error);
  }

  // フォールバック: 認証なしで初期化
  return new TextToSpeechClient();
}

export async function synthesizeTextWithGoogle(
  text: string,
  options: Partial<TTSOptions>
): Promise<Buffer> {
  const ttsClient = createGoogleTTSClient();

  const [response] = await ttsClient.synthesizeSpeech({
    input: { text: text.trim() },
    voice: {
      languageCode: options.languageCode ?? 'ja-JP',
      name:
        options.voiceName ??
        GOOGLE_VOICES.premium['Neural2'].male['ja-JP-Neural2-C'],
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: options.speakingRate ?? 1.0,
      pitch: options.pitch ?? 0.0,
      volumeGainDb: options.volumeGainDb ?? 0.0,
    },
  });

  if (!response.audioContent) {
    throw new Error('No audio content received from TTS API');
  }

  return Buffer.from(response.audioContent as string, 'base64');
}
