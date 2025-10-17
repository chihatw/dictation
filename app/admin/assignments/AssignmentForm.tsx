'use client';

type DefaultValues = {
  id?: string;
  title?: string;
  user_id?: string;
  due_at?: string | null; // ISO(UTC) or null
};

function toInputValueFromUTC(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso); // UTC基準
  // UTCに+9hして「JST時刻」を作る
  const t = new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      d.getUTCHours() + 9,
      d.getUTCMinutes(),
      0,
      0
    )
  );
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(
    t.getUTCDate()
  )}T${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}`;
}

export default function AssignmentForm({
  defaultValues,
  action,
  submitLabel,
  userDisplay,
}: {
  defaultValues?: DefaultValues;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
  userDisplay: string;
}) {
  return (
    <form action={action} className='space-y-4'>
      {defaultValues?.id && (
        <input type='hidden' name='id' defaultValue={defaultValues.id} />
      )}
      {defaultValues?.user_id && (
        <input
          type='hidden'
          name='user_id'
          defaultValue={defaultValues.user_id}
        />
      )}

      <div className='space-y-1'>
        <label className='text-sm font-medium'>ユーザー</label>
        <div className='rounded-md border px-3 py-2 bg-gray-50 text-sm'>
          {userDisplay}
        </div>
      </div>

      <div className='space-y-1'>
        <label className='text-sm font-medium'>タイトル</label>
        <input
          name='title'
          defaultValue={defaultValues?.title ?? ''}
          required
          className='w-full rounded-md border px-3 py-2'
          placeholder='課題名'
        />
      </div>

      <div className='space-y-1'>
        <label className='text-sm font-medium'>期限（日本時間）</label>
        <input
          type='datetime-local'
          name='due_at_jst'
          // JST表示用に整形
          defaultValue={toInputValueFromUTC(defaultValues?.due_at ?? null)}
          className='w-full rounded-md border px-3 py-2'
        />
        <p className='text-xs text-gray-500'>未入力なら期限なし</p>
      </div>

      <div className='pt-2'>
        <button
          type='submit'
          className='rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50'
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
