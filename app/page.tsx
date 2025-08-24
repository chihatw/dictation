'use client';

import { useChat } from '@/hooks/useChat';
import { useTTS } from '@/hooks/useTTS';
import { GOOGLE_VOICES } from '@/libs/tts/constants';
import { useEffect, useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);

  const [audioPlayed, setAudioPlayed] = useState(false);

  const correctScript = 'The quick brown fox jumps over the lazy dog.';

  const { play, loading: ttsLoading, error: ttsError } = useTTS();
  const {
    history,
    sendMessage,
    loading: chatLoading,
    error: chatError,
  } = useChat();

  // Function to handle audio playback
  const handlePlayAudio = async () => {
    play('こんにちは', {
      voiceName:
        GOOGLE_VOICES.premium['Chirp3-HD'].female['ja-JP-Chirp3-HD-Aoede'],
    });
    setAudioPlayed(true);
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setFeedback({ isCorrect: false, message: '何か入力してください' });
      return;
    }

    setFeedback(null);

    // while (attempts < maxAttempts) {
    try {
      const prompt = `以下の『正しい音声スクリプト』と『学習者の入力』を比較し、間違いを具体的に指摘してください。
                        間違いがない場合は、「完璧です！」と返答してください。
                        フィードバックは日本語でお願いします。
                        学習者を励ますこと、やる気を上げることを意識してください。
                        一部でも正しく聞けていれば褒めてください。
                        間違いがあった場合も、学習者の立場に立って優しく丁寧に指摘してください。
　　　　　　　　　　　　　　回答は視認性が上がるように改行を入れてください。                        


                        正しい音声スクリプト: "${correctScript}"
                        学習者の入力: "${userInput}"`;
      await sendMessage(prompt);

      const aiFeedback = '';
      const isCorrect = aiFeedback.includes('完璧です！');
      setFeedback({ isCorrect, message: aiFeedback });
    } catch (error) {}
  };
  useEffect(() => {
    if (history.length === 2) {
      const aiFeedback = history[1].content;
      const isCorrect = aiFeedback.includes('完璧です！');
      setFeedback({ isCorrect, message: aiFeedback });
    }
  }, [history]);

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
          disabled={chatLoading}
        ></textarea>

        {/* 提出ボタン */}
        <button
          onClick={handleSubmit}
          className={`w-full py-4 rounded-lg text-white font-extrabold text-xl tracking-wide transition-all duration-300 shadow-lg
            ${
              chatLoading || !audioPlayed
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            }`}
          disabled={chatLoading || !audioPlayed} // 音声が再生されるまでボタンを無効化
        >
          {chatLoading ? (
            <div className='flex items-center justify-center space-x-2'>
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
            <p className='text-base leading-relaxed whitespace-pre-wrap'>
              {feedback.message}
            </p>
            {!feedback.isCorrect && (
              <div className='mt-4 pt-4 border-t border-red-400'>
                <p className='text-sm'>
                  <span className='font-bold'>正解:</span>{' '}
                  {`"${correctScript}"`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
