import { synthesizeText } from '@/lib/tts';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // ← Edge で動かさない

export async function POST(req: NextRequest) {
  const { text, languageCode, voiceName, speakingRate, pitch, volumeGainDb } =
    await req.json();

  if (!text) {
    return NextResponse.json({ message: 'Text is required' }, { status: 400 });
  }

  try {
    // TTS API で音声を生成、Buffer を取得
    // languageCode 以下は、undefined の場合があるため、synthesizeText 内でデフォルト値を設定
    const audioBuffer: Buffer = await synthesizeText(text, {
      languageCode,
      speakingRate,
      pitch,
      voiceName,
      volumeGainDb,
    });

    // 音声データ（バイト列）をレスポンスとして返す
    return new NextResponse(new Uint8Array(audioBuffer), {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error) {
    console.error('Error in text-to-speech API:', error);
    return NextResponse.json(
      { message: 'Internal Server Error', error: (error as Error).message },
      { status: 500 }
    );
  }
}
