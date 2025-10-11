'use client';

type DefaultValues = { id?: string; title?: string; user_id?: string };

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

      {/* user_id は hidden */}
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
          placeholder='コレクション名'
        />
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
