'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserInput } from '@/types/dictation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserSelect({
  users,
  selectedUserId,
}: {
  users: UserInput[];
  selectedUserId?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  function updateQuery(uid: string | undefined) {
    const next = new URLSearchParams(sp);
    if (uid && uid !== 'none') next.set('user_id', uid);
    else next.delete('user_id');
    router.replace(`${pathname}${next.toString() ? `?${next}` : ''}`);
  }

  return (
    <div className='space-y-1'>
      <Label htmlFor='user-select'>User</Label>
      <Select
        value={selectedUserId || 'none'}
        onValueChange={(v) => updateQuery(v)}
      >
        <SelectTrigger id='user-select' className='w-[280px]'>
          <SelectValue placeholder='-- select user --' />
        </SelectTrigger>
        <SelectContent className='w-[280px]'>
          <SelectItem value='none'>-- select user --</SelectItem>
          {users.map((u) => (
            <SelectItem key={u.uid} value={u.uid}>
              {u.display}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
