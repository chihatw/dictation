import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// Google Cloud Text-to-Speech API クライアントを作成
export function createTTSClient(): TextToSpeechClient {
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
