'use client';

export function BodyTextarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className='flex flex-col gap-2'>
      <label className='text-sm font-medium'>本文（句点で自動分割）</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='min-h-[200px] rounded-md border px-3 py-2 text-sm'
        placeholder={`例）
今日は雨です。明日は晴れるでしょう。
ディクテーションの練習を始めます。`}
      />
      <p className='text-xs text-gray-500'>
        文末記号（。．.!? など）や改行で分割します。空行は無視されます。
      </p>
    </div>
  );
}
