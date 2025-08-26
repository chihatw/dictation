'use client';

import { DEFAULT_RATE } from '@/lib/tts/constants';

export function RateInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>話速（speaking_rate）</label>
      <input
        type='number'
        step={0.1}
        min={0.5}
        max={2.0}
        value={value}
        onChange={(e) => {
          const num = Number(e.target.value);
          onChange(Number.isFinite(num) ? num : DEFAULT_RATE);
        }}
        className='rounded-md border px-3 py-2 text-sm'
      />
      <p className='text-xs text-gray-500'>
        推奨 0.5–2.0（DB 許容: 0 &lt; rate ≤ 4.0）。1.0 が等倍。
      </p>
    </div>
  );
}
