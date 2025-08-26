'use client';

import { VOICES, VoiceOption } from '@/lib/tts/constants';

export function VoiceSelector({
  value,
  onChange,
}: {
  value: VoiceOption;
  onChange: (v: VoiceOption) => void;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>音声（tts_voice_name）</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as VoiceOption)}
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
  );
}
