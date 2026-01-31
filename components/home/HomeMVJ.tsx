import { fmtDate, fmtTime } from '@/app/mvjs/[id]/utils';
import { addDays, isWithinInterval, startOfMonth } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import Link from 'next/link';

const TZ = 'Asia/Taipei';

export const HomeMVJ = ({
  mvjId,
  mvjImageUrl,
  mvjReason,
  mvjDueAtUtc,
  mvjTitle,
}: {
  mvjId: string;
  mvjImageUrl: string;
  mvjReason: string;
  mvjDueAtUtc: Date;
  mvjTitle: string;
}) => {
  const mvjDueAtTz = toZonedTime(mvjDueAtUtc, TZ);

  const monthStartTz = startOfMonth(mvjDueAtTz);

  const nextDayStartTz = addDays(
    new Date(
      mvjDueAtTz.getFullYear(),
      mvjDueAtTz.getMonth(),
      mvjDueAtTz.getDate(),
      0,
      0,
      0,
      0,
    ),
    1,
  );

  const nowTz = toZonedTime(new Date(), TZ);

  const showMVJPane = isWithinInterval(nowTz, {
    start: monthStartTz,
    end: nextDayStartTz,
  });

  if (!mvjId || !showMVJPane) return null;

  const prev = new Date(mvjDueAtUtc);
  prev.setMonth(mvjDueAtUtc.getMonth() - 1);
  return (
    <section className='rounded-xl border p-5 bg-amber-50 space-y-3 flex flex-col shadow-xl'>
      <div className='grid gap-1'>
        <Link href={`/mvjs/${mvjId}`} className='text-center hover:underline'>
          <span className='font-bold text-2xl text-slate-900 text-shadow-2xs'>
            {`🏆 ${mvjTitle} 🏆`}
          </span>
        </Link>
        <div className='text-xs text-center text-slate-500 flex items-center justify-center gap-x-2'>
          <div>截止日期:</div>
          <div>{`${fmtDate(mvjDueAtUtc)} 凌晨${fmtTime(mvjDueAtUtc)}。`}</div>
        </div>
      </div>
      {mvjImageUrl && (
        <div className='flex justify-center'>
          <img
            src={mvjImageUrl}
            alt='最佳作品圖片'
            className='rounded shadow-md max-h-64 object-contain'
          />
        </div>
      )}
      {mvjReason && (
        <div className='grid text-center text-sm text-slate-700'>
          {mvjReason}
        </div>
      )}
    </section>
  );
};
