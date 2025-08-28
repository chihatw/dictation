'use client';

import { createArticleAction } from '@/app/admin/article/actions';
import { UserPicker } from '@/components/admin/UserPicker';
import { TTSPlayButton } from '@/components/audio/TTSPlayButton';
import {
  DEFAULT_RATE,
  DEFAULT_VOICE,
  VOICES,
  VoiceOption,
  clampRateForDB,
  isReasonableRate,
} from '@/lib/tts/constants';
import { splitIntoSentences } from '@/lib/tts/splitSentences';
import { useState } from 'react';
import { BodyTextarea } from './BodyTextarea';
import { RateInput } from './RateInput';
import { VoiceSelector } from './VoiceSelector';

export function ArticleCreateForm() {
  const [uid, setUid] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [ttsVoiceName, setTtsVoiceName] = useState<VoiceOption>(DEFAULT_VOICE);
  const [speakingRate, setSpeakingRate] = useState<number>(DEFAULT_RATE);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const previewText = splitIntoSentences(body).join(' ');

  const canSubmit =
    !!uid &&
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    VOICES.includes(ttsVoiceName) &&
    isReasonableRate(speakingRate) &&
    !submitting;

  const handleCreate = async () => {
    setErr(null);
    setOkMsg(null);
    if (!canSubmit) return;

    setSubmitting(true);
    const res = await createArticleAction({
      uid,
      title,
      body,
      ttsVoiceName,
      speakingRate,
    });

    if (!res.ok) {
      setErr(res.error ?? '作成に失敗しました。');
    } else {
      setOkMsg(`作成しました（文 ${res.sentenceCount} 件）。`);
      setTitle('');
      setBody('');
      setUid(null);
      setTtsVoiceName(DEFAULT_VOICE);
      setSpeakingRate(DEFAULT_RATE);
    }
    setSubmitting(false);
  };

  return (
    <div className='space-y-4'>
      <UserPicker value={uid} onChange={setUid} />

      {/* タイトル */}
      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium'>タイトル</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='rounded-md border px-3 py-2 text-sm'
          placeholder='Untitled'
        />
      </div>

      {/* 音声/話速 */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <VoiceSelector value={ttsVoiceName} onChange={setTtsVoiceName} />
        <RateInput value={speakingRate} onChange={setSpeakingRate} />
      </div>

      {/* 本文 + プレビュー */}
      <BodyTextarea value={body} onChange={setBody} />
      <div className='mt-1'>
        <TTSPlayButton
          text={previewText}
          voiceName={ttsVoiceName}
          speakingRate={clampRateForDB(speakingRate)}
          variant='outline'
          size='sm'
          className='rounded-md'
          labels={{
            idle: '本文をプレビュー再生',
            loading: '音声準備中…',
            stop: '停止',
            aria: '本文を読み上げ',
          }}
        />
      </div>

      {/* 作成ボタン */}
      <button
        onClick={handleCreate}
        disabled={!canSubmit}
        className='rounded-md bg-black px-4 py-2 text-white disabled:opacity-50'
      >
        {submitting ? '作成中…' : '作成する'}
      </button>

      {err && <p className='text-sm text-red-600'>エラー: {err}</p>}
      {okMsg && <p className='text-sm text-green-700'>{okMsg}</p>}
    </div>
  );
}
