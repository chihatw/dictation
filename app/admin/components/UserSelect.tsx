'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserCore } from '@/types/dictation';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function UserSelect({
  users,
  selectedUserId,
}: {
  users: UserCore[];
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
        <SelectTrigger id='user-select' className='w-70'>
          <SelectValue placeholder='-- select user --' />
        </SelectTrigger>
        <SelectContent className='w-70'>
          <SelectItem value='none'>-- select user --</SelectItem>
          {users.map((u) => (
            <SelectItem key={u.user_id} value={u.user_id}>
              {u.display}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
