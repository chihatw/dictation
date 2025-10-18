'use client';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

type Props = {
  months: string[]; // e.g. ["2025-10","2025-09",...]
  month?: string;
  assignments: { id: string; title: string; due_at: string }[];
  assignmentId?: string;
};

export default function AssignmentPicker({
  months,
  month,
  assignments,
  assignmentId,
}: Props) {
  const router = useRouter();

  const setParam = (next: Record<string, string | undefined>) => {
    const url = new URL(window.location.href);
    const params = url.searchParams;

    Object.entries(next).forEach(([k, v]) => {
      if (v === undefined || v === '') params.delete(k);
      else params.set(k, v);
    });

    // assignment が変わったら journal_ids はクリア
    if (next.assignment_id && next.assignment_id !== assignmentId) {
      params.delete('journal_ids');
    }
    // month が変わったら assignment と journal_ids をクリア
    if (next.month && next.month !== month) {
      params.delete('assignment_id');
      params.delete('journal_ids');
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  return (
    <div className='space-y-4'>
      {/* 1段目：月份 */}
      <div className='space-y-2'>
        <Label className='text-sm text-slate-600'>月份</Label>
        <Select
          value={month ?? ''}
          onValueChange={(v) => setParam({ month: v })}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='選擇月份' />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {labelFromYmKey(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 2段目：作業 */}
      <div className='space-y-2'>
        <Label className='text-sm text-slate-600'>作業</Label>
        <Select
          value={assignmentId ?? ''}
          onValueChange={(v) => setParam({ assignment_id: v })}
          disabled={!assignments.length}
        >
          <SelectTrigger className='w-full' disabled={!assignments.length}>
            <SelectValue
              placeholder={assignments.length ? '選擇作業' : '該月份に作業なし'}
            />
          </SelectTrigger>
          <SelectContent>
            {assignments.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {formatMdTpe(a.due_at)} {a.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function labelFromYmKey(key: string) {
  // key: YYYY-MM → YYYY年M月
  const [y, m] = key.split('-');
  return `${y}年${Number(m)}月`;
}

function formatMdTpe(iso: string) {
  // "MM月DD日"（Asia/Taipei）
  const d = new Date(iso);
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Taipei',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d);
  const mm = parts.find((p) => p.type === 'month')?.value ?? '01';
  const dd = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${mm}月${dd}日`;
}
