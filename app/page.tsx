'use client';

import { useTTS } from '@/hooks/useTTS';
import { GOOGLE_VOICES } from '@/libs/tts/constants';
import { GoogleGenAI } from '@google/genai';
import { useState } from 'react';

// GoogleGenAIクライアントをAPIキーで初期化
const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);

  const [loadingImageUrl, setLoadingImageUrl] = useState('');

  const correctScript = 'The quick brown fox jumps over the lazy dog.';

  const { play, loading, error } = useTTS();

  // Function to handle audio playback
  const handlePlayAudio = async () => {
    play('こんにちは', {
      voiceName:
        GOOGLE_VOICES.premium['Chirp3-HD'].male['ja-JP-Chirp3-HD-Orus'],
    });
    setAudioPlayed(true);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log('hello');
    if (!userInput.trim()) {
      setFeedback({ isCorrect: false, message: '何か入力してください' });
      return;
    }

    setIsLoading(true);
    setFeedback(null);

    let attempts = 0;
    const maxAttempts = 5;
    let delay = 1000; // 最初の遅延は1秒

    while (attempts < maxAttempts) {
      try {
        const chatHistory = [];
        const prompt = `以下の『正しい音声スクリプト』と『学習者の入力』を比較し、間違いを具体的に指摘してください。
                        間違いがない場合は、「完璧です！」と返答してください。
                        フィードバックは日本語でお願いします。

                        正しい音声スクリプト: "${correctScript}"
                        学習者の入力: "${userInput}"`;
        chatHistory.push({ role: 'user', parts: [{ text: prompt }] });
        const payload = {
          contents: chatHistory,
          model: 'gemini-2.5-flash',
          config: { thinkingConfig: { thinkingBudget: 0 } },
        };

        const response = await ai.models.generateContent(payload);

        if (!!response.text) {
          const aiFeedback = response.text;
          const isCorrect = aiFeedback.includes('完璧です！');
          setFeedback({ isCorrect, message: aiFeedback });
          break; // 成功したら while を抜ける
        } else {
          console.error('予期しないAPIレスポンス:', response);
        }
      } catch (error) {
        console.error('APIリクエストエラー:', error);
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`再試行 ${attempts}/${maxAttempts}...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // 次の遅延は倍にする
        } else {
          setFeedback({
            isCorrect: false,
            message:
              'サーバーエラーが発生しました。後でもう一度お試しください。',
          });
        }
      }
    }
    setIsLoading(false);
  };
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl'>
        <h2 className='text-3xl font-bold text-center mb-8 text-gray-800'>
          英語ディクテーション練習
        </h2>

        {/* 音声プレイヤー */}
        <div className='flex flex-col items-center justify-center mb-6'>
          <button
            onClick={handlePlayAudio}
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md flex items-center space-x-2'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path
                fillRule='evenodd'
                d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.53 0 3.242L7.28 20.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z'
                clipRule='evenodd'
              />
            </svg>
            <span>音声を再生</span>
          </button>
          {!audioPlayed && (
            <p className='text-sm text-gray-500 mt-2'>
              まず音声を再生してください
            </p>
          )}
        </div>

        {/* 入力エリア */}
        <textarea
          className='w-full h-40 p-5 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-200 mb-6 resize-none shadow-sm placeholder:text-gray-400'
          placeholder='聞こえた文章をここに正確に入力してください...'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={isLoading}
        ></textarea>

        {/* 提出ボタン */}
        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-lg text-white font-extrabold text-xl tracking-wide transition-all duration-300 shadow-lg
            ${
              isLoading || !audioPlayed
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            }`}
          disabled={isLoading || !audioPlayed} // 音声が再生されるまでボタンを無効化
        >
          {isLoading ? (
            <div className='flex items-center justify-center space-x-2'>
              {loadingImageUrl ? (
                <img
                  src={loadingImageUrl}
                  alt='Loading'
                  className='w-8 h-8 animate-spin rounded-full'
                />
              ) : (
                <div className='w-6 h-6 border-4 border-t-4 border-t-white border-gray-200 rounded-full animate-spin'></div>
              )}
              <span>判定中...</span>
            </div>
          ) : (
            '提出して答え合わせ'
          )}
        </button>

        {/* フィードバックエリア */}
        {feedback && (
          <div
            className={`mt-8 p-6 rounded-lg text-white font-semibold text-lg text-center shadow-lg
            ${feedback.isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <p className='mb-2 text-2xl'>
              {feedback.isCorrect
                ? '✨ 完璧です！ ✨'
                : '🤔 もう一度試してみましょう 🤔'}
            </p>
            <p className='text-base leading-relaxed'>{feedback.message}</p>
            {!feedback.isCorrect && (
              <div className='mt-4 pt-4 border-t border-red-400'>
                <p className='text-sm'>
                  <span className='font-bold'>正解:</span>{' '}
                  {`"${correctScript}"`}
                </p>
              </div>
            )}
            <button
              onClick={() => {
                setUserInput('');
                setFeedback(null);
                setAudioPlayed(false); // 次の問題のためにリセット
              }}
              className='mt-6 bg-white text-gray-800 px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition-colors duration-200 shadow'
            >
              次の問題へ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
