'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo } from 'react';

type User = { uid: string; display: string };
type DefaultValues = { id?: string; title?: string; user_id?: string };

export default function CollectionForm({
  users,
  defaultValues,
  action,
  submitLabel,
}: {
  users: User[];
  defaultValues?: DefaultValues;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const sorted = useMemo(
    () => [...users].sort((a, b) => a.display.localeCompare(b.display, 'ja')),
    [users]
  );

  return (
    <form action={action} className='space-y-4'>
      {defaultValues?.id && (
        <input type='hidden' name='id' defaultValue={defaultValues.id} />
      )}

      <div className='space-y-1'>
        <label className='text-sm font-medium'>タイトル</label>
        <input
          name='title'
          defaultValue={defaultValues?.title ?? ''}
          required
          className='w-full rounded-md border px-3 py-2'
          placeholder='コレクション名'
        />
      </div>

      <div className='space-y-1'>
        <label className='text-sm font-medium'>ユーザー（owner）</label>
        <Select
          name='user_id'
          defaultValue={defaultValues?.user_id ?? ''}
          required
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='選択してください' />
          </SelectTrigger>
          <SelectContent>
            {sorted.map((u) => (
              <SelectItem key={u.uid} value={u.uid}>
                {u.display}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
