'use client';

import { TTSPlayButton } from '@/components/TTSPlayButton';
import { supabase } from '@/lib/supabase/browser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type UserRow = {
  uid: string;
  display: string;
  created_at: string;
};

type Props = {};

// 選択可能な日本語音声
const VOICES = [
  'ja-JP-Chirp3-HD-Charon',
  'ja-JP-Chirp3-HD-Fenrir',
  'ja-JP-Chirp3-HD-Orus',
  'ja-JP-Chirp3-HD-Puck',
  'ja-JP-Chirp3-HD-Aoede',
  'ja-JP-Chirp3-HD-Kore',
  'ja-JP-Chirp3-HD-Leda',
  'ja-JP-Chirp3-HD-Zephyr',
] as const;
type VoiceOption = (typeof VOICES)[number];

const DEFAULT_VOICE: VoiceOption = 'ja-JP-Chirp3-HD-Aoede';
const DEFAULT_RATE = 1.0;

// DB 側は 0 < rate <= 4.0 を許容している想定。
// UI では 0.5–2.0 を推奨レンジとして扱いつつ、最終的に DB 許容範囲にクリップ。
const clampRateForDB = (n: number) => Math.max(0.1, Math.min(4.0, n));
const isReasonableRate = (n: number) => n > 0 && n <= 4.0;

const CreateArticlePage = (props: Props) => {
  const router = useRouter();

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
    uid &&
    title.trim().length > 0 &&
    body.trim().length > 0 &&
    VOICES.includes(ttsVoiceName) &&
    isReasonableRate(speakingRate) &&
    !submitting;

  const handleCreate = async () => {
    setErr(null);
    setOkMsg(null);

    if (!uid) {
      setErr('uid が選択されていません。');
      return;
    }
    if (!title.trim()) {
      setErr('タイトルを入力してください。');
      return;
    }
    const sentences = splitIntoSentences(body);
    if (sentences.length === 0) {
      setErr('本文から文が抽出できませんでした。');
      return;
    }
    if (!VOICES.includes(ttsVoiceName)) {
      setErr('音声の選択が不正です。');
      return;
    }
    if (!isReasonableRate(speakingRate)) {
      setErr('話速の値が不正です。');
      return;
    }

    setSubmitting(true);
    try {
      // 1) article を作成
      const { data: article, error: insErr } = await supabase
        .from('dictation_articles')
        .insert({
          uid,
          title: title.trim(),
          tts_voice_name: ttsVoiceName,
          speaking_rate: clampRateForDB(speakingRate),
        })
        .select('id')
        .single();

      if (insErr) throw insErr;
      const articleId = article!.id as string;

      // 2) sentences を一括挿入
      const rows = sentences.map((content, i) => ({
        article_id: articleId,
        seq: i + 1, // 1始まり
        content,
      }));

      const { error: senErr } = await supabase
        .from('dictation_sentences')
        .insert(rows);

      if (senErr) {
        // 失敗したら作った記事を削除して整合性を保つ（簡易ロールバック）
        await supabase.from('dictation_articles').delete().eq('id', articleId);
        throw senErr;
      }

      setOkMsg(`作成しました（文 ${rows.length} 件）。`);
      // 一覧や詳細に遷移したい場合はここで
      // router.push(`/articles/${articleId}`);
      setTitle('');
      setBody('');
      setUid(null);
      setTtsVoiceName(DEFAULT_VOICE);
      setSpeakingRate(DEFAULT_RATE);
    } catch (e: any) {
      setErr(e?.message ?? '作成に失敗しました。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='mx-auto max-w-2xl p-6 space-y-6'>
      <h1 className='text-2xl font-semibold'>Article 作成（管理者）</h1>

      <div className='space-y-4'>
        <UserPicker onChange={setUid} />

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

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>
              音声（tts_voice_name）
            </label>
            <select
              value={ttsVoiceName}
              onChange={(e) => setTtsVoiceName(e.target.value as VoiceOption)}
              className='rounded-md border px-3 py-2 text-sm'
            >
              {VOICES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <p className='text-xs text-gray-500'>
              API に渡す SSML の voice 名を保存します。
            </p>
          </div>

          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>話速（speaking_rate）</label>
            <input
              type='number'
              step={0.1}
              min={0.5}
              max={2.0}
              value={speakingRate}
              onChange={(e) => {
                const num = Number(e.target.value);
                setSpeakingRate(Number.isFinite(num) ? num : DEFAULT_RATE);
              }}
              className='rounded-md border px-3 py-2 text-sm'
            />
            <p className='text-xs text-gray-500'>
              推奨 0.5–2.0（DB 許容: 0 &lt; rate ≤ 4.0）。1.0 が等倍。
            </p>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium'>本文（句点で自動分割）</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className='min-h-[200px] rounded-md border px-3 py-2 text-sm'
            placeholder={`例）
今日は雨です。明日は晴れるでしょう。
ディクテーションの練習を始めます。`}
          />
          <p className='text-xs text-gray-500'>
            文末記号（。．.!? など）や改行で分割します。空行は無視されます。
          </p>

          <div className='mt-1'>
            <TTSPlayButton
              text={previewText}
              voiceName={ttsVoiceName}
              // プレビュー時もDB許容範囲にクリップしておくと安全
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
        </div>

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
    </main>
  );
};

export default CreateArticlePage;

function UserPicker({ onChange }: { onChange?: (uid: string | null) => void }) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    let aborted = false;
    (async () => {
      const { data, error } = await supabase
        .from('users')
        .select('uid, display, created_at')
        .order('created_at', { ascending: true });

      if (aborted) return;

      if (error) {
        setUsers([]);
      } else {
        setUsers(data ?? []);
      }
    })();
    return () => {
      aborted = true;
    };
  }, [supabase, onChange]);

  useEffect(() => {
    onChange?.(value === '' ? null : value);
  }, [value, onChange]);

  return (
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className='w-full border border-gray-300 rounded px-3 py-2'
    >
      <option value=''>- 選択してください -</option>
      {users.map((u) => (
        <option key={u.uid} value={u.uid}>
          {u.display}（{u.uid.slice(0, 8)}…）
        </option>
      ))}
    </select>
  );
}

// 日本語・中華圏・英語の文末記号で分割（記号は保持）
// - 連続改行は区切りとしても扱う
// - 空白/全角空白をtrim、空行は除外
function splitIntoSentences(raw: string): string[] {
  // 改行も文区切りに寄与させるため一旦正規化
  const normalized = raw
    .replace(/\r\n?/g, '\n')
    // 見出し用の全角スペース等を標準化
    .replace(/\u3000/g, ' ');

  // 文末の候補
  // 。 ． . ！ ! ？ ? （全角/半角）
  // 改行も区切りとして使う（連続改行はまとめて区切り）
  const pattern = /(?<=。|．|\.|！|!|？|\?)|\n+/g;

  const parts = normalized
    .split(pattern)
    .map((s) => s.replace(/\s+/g, ' ').trim()) // 連続空白を1つに
    .map((s) => s.replace(/\s+$/g, '')) // 末尾空白
    .filter((s) => s.length > 0);

  // 文末記号が無くても1行を文として許容（見出し行など）
  return parts;
}
