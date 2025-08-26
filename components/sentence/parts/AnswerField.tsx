'use client';

import { memo } from 'react';

const EditableBase = ({
  value,
  onChange,
  placeholder,
  readOnly,
  ariaDescribedBy,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  ariaDescribedBy?: string;
}) => (
  <textarea
    className='w-full resize-y rounded-md border p-3 outline-none focus:ring-2 focus:ring-gray-900'
    rows={3}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    readOnly={readOnly}
    aria-busy={readOnly}
    aria-describedby={ariaDescribedBy}
    style={readOnly ? { opacity: 0.7 } : undefined}
  />
);

const ReadOnlyBase = ({
  value,
  label = '你的回答（已送出）',
}: {
  value: string;
  label?: string;
}) => (
  <div className='rounded-md border bg-gray-50 p-3'>
    <div className='mb-1 text-xs font-semibold text-gray-500'>{label}</div>
    <p className='whitespace-pre-wrap text-gray-800'>{value}</p>
  </div>
);

export const AnswerField = {
  Editable: memo(EditableBase),
  ReadOnly: memo(ReadOnlyBase),
};
