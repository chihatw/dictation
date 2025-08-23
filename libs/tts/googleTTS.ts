import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { GOOGLE_DEFAULT_TTS_OPTIONS } from './constants';
import { TTSOptions } from './types';

function createGoogleTTSClient(): TextToSpeechClient {
  try {
    const encodedCredentials =
      process.env.NEXT_PUBLIC_GOOGLE_APPLICATION_CREDENTIALS;
    if (encodedCredentials) {
      const decodedCredentials = Buffer.from(
        encodedCredentials,
        'base64'
      ).toString('utf-8');
      const credentials = JSON.parse(decodedCredentials);

      return new TextToSpeechClient({
        projectId: credentials.project_id,
        credentials: {
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        },
      });
    }
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
      languageCode:
        options.languageCode ?? GOOGLE_DEFAULT_TTS_OPTIONS.languageCode,
      name: options.voiceName ?? GOOGLE_DEFAULT_TTS_OPTIONS.voiceName,
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate:
        options.speakingRate ?? GOOGLE_DEFAULT_TTS_OPTIONS.speakingRate,
      pitch: options.pitch ?? GOOGLE_DEFAULT_TTS_OPTIONS.pitch,
      volumeGainDb:
        options.volumeGainDb ?? GOOGLE_DEFAULT_TTS_OPTIONS.volumeGainDb,
    },
  });

  if (!response.audioContent) {
    throw new Error('No audio content received from TTS API');
  }

  return Buffer.from(response.audioContent as string, 'base64');
}
