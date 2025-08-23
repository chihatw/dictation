import { synthesizeTextWithGoogle } from './googleTTS';
import { TTSOptions } from './types';

export async function synthesizeText(
  text: string,
  options: TTSOptions
): Promise<Buffer> {
  const provider = process.env.TTS_PROVIDER ?? 'google';

  switch (provider) {
    case 'google':
      return synthesizeTextWithGoogle(text, options);
    // case 'polly':
    //   return synthesizeTextWithPolly(text, options);
    default:
      throw new Error(`Unsupported TTS provider: ${provider}`);
  }
}
