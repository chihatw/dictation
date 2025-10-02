// app/admin/articles/_components/ArticleCreateForm.tsx
'use client';

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
import { useMemo, useState } from 'react';
import { createArticle } from '../actions';

type User = { uid: string; display: string };
type Col = { id: string; title: string; user_id: string };

export function ArticleCreateForm({
  users,
  collections,
}: {
  users: User[];
  collections: Col[];
}) {
  const [userId, setUserId] = useState<string>('');
  const [collectionId, setCollectionId] = useState<string>('');
  const [subtitle, setSubtitle] = useState('');
  const [body, setBody] = useState('');

  const [voice, setVoice] = useState<VoiceOption>(DEFAULT_VOICE);
  const [rate, setRate] = useState<number>(DEFAULT_RATE);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const collectionsOfUser = useMemo(
    () => collections.filter((c) => c.user_id === userId),
    [collections, userId]
  );

  const previewText = splitIntoSentences(body).join(' ');

  const canSubmit =
    userId &&
    collectionId &&
    subtitle.trim().length > 0 &&
    body.trim().length > 0 &&
    VOICES.includes(voice) &&
    isReasonableRate(rate) &&
    !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setErr(null);
    setOk(null);

    const res = await createArticle({
      collectionId,
      subtitle: subtitle.trim(),
      body,
      ttsVoiceName: voice,
      speakingRate: rate,
    });

    if (!res.ok) setErr(res.error ?? '作成に失敗しました');
    else {
      setOk(`作成しました（文 ${res.sentenceCount} 件）`);
      setSubtitle('');
      setBody('');
    }
    setSubmitting(false);
  };

  return (
    <div className='space-y-4'>
      {/* ユーザー / コレクション */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>ユーザー</label>
          <select
            value={userId}
            onChange={(e) => {
              setUserId(e.target.value);
              setCollectionId('');
            }}
            className='w-full rounded-md border px-3 py-2 text-sm'
          >
            <option value=''>選択</option>
            {users.map((u) => (
              <option key={u.uid} value={u.uid}>
                {u.display}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-1'>
          <label className='text-sm font-medium'>コレクション</label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            disabled={!userId}
            className='w-full rounded-md border px-3 py-2 text-sm disabled:opacity-50'
          >
            <option value=''>選択</option>
            {collectionsOfUser.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* subtitle */}
      <div className='space-y-1'>
        <label className='text-sm font-medium'>subtitle</label>
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className='w-full rounded-md border px-3 py-2 text-sm'
          placeholder='Untitled'
        />
      </div>

      {/* 音声/話速 */}
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>Voice</label>
          <select
            value={voice}
            onChange={(e) => setVoice(e.target.value as VoiceOption)}
            className='w-full rounded-md border px-3 py-2 text-sm'
          >
            {VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className='space-y-1'>
          <label className='text-sm font-medium'>Rate</label>
          <input
            type='number'
            step='0.05'
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className='w-full rounded-md border px-3 py-2 text-sm'
          />
        </div>
      </div>

      {/* 本文 + プレビュー */}
      <div className='space-y-1'>
        <label className='text-sm font-medium'>本文</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className='h-40 w-full rounded-md border px-3 py-2 text-sm'
        />
      </div>

      <div>
        <TTSPlayButton
          text={previewText}
          voiceName={voice}
          speakingRate={clampRateForDB(rate)}
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

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className='rounded-md bg-black px-4 py-2 text-white disabled:opacity-50'
      >
        {submitting ? '作成中…' : '作成する'}
      </button>

      {err && <p className='text-sm text-red-600'>エラー: {err}</p>}
      {ok && <p className='text-sm text-green-700'>{ok}</p>}
    </div>
  );
}
