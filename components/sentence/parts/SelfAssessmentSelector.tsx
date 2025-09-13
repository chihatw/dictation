import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

type Props = {
  value: number; // 1..4
  onChange: (v: number) => void;
  describedById?: string;
};

const HELP: Record<number, string> = {
  1: '只抓到少數字詞，無法重述意思',
  2: '懂大意，但細節不完整',
  3: '幾乎全懂，能口頭重述',
  4: '能正確理解，且可在會話／寫作中運用',
};

export function SelfAssessmentSelectorCompact({
  value,
  onChange,
  describedById,
}: Props) {
  return (
    <div>
      <Label className='text-sm font-medium'>理解度</Label>
      <p id={describedById} className='mt-1 text-xs text-muted-foreground'>
        請選擇你對這句話的理解程度。
      </p>

      <ToggleGroup
        type='single'
        value={String(value)}
        onValueChange={(v) => v && onChange(Number(v))}
        className='mt-2 flex flex-wrap gap-2'
        aria-describedby={describedById}
      >
        <ToggleGroupItem value='1' aria-label='幾乎完全聽不懂'>
          😕 聽不懂
        </ToggleGroupItem>
        <ToggleGroupItem value='2' aria-label='大致上聽懂'>
          🙂 大致懂
        </ToggleGroupItem>
        <ToggleGroupItem value='3' aria-label='幾乎完全聽懂'>
          😀 幾乎全懂
        </ToggleGroupItem>
        <ToggleGroupItem value='4' aria-label='聽懂且能運用'>
          🗣️✍️ 可運用
        </ToggleGroupItem>
      </ToggleGroup>

      <p className='mt-2 text-xs text-muted-foreground min-h-5'>
        {HELP[value as 1 | 2 | 3 | 4] ?? '請先選擇一個選項'}
      </p>
    </div>
  );
}
