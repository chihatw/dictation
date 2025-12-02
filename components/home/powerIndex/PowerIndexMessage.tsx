import { cn } from '@/lib/utils';

export const PowerIndexMessage = ({
  hasSubmissions,
  idleDays,
  nextPenalty,
  currentStreakDays,
}: {
  hasSubmissions: boolean;
  idleDays: number;
  nextPenalty: number;
  currentStreakDays: number;
}) => {
  const computedStreakDays = currentStreakDays + Number(hasSubmissions);
  return (
    <div className='text-sm text-gray-500 font-extralight leading-none'>
      <StreakDays currentStreakDays={computedStreakDays} />
      {hasSubmissions ? (
        <div className={cn('pb-2', computedStreakDays === 1 ? 'pt-1.5' : '')}>
          今天有練習呢！請保持這個節奏，每天都持續一點點就很好。
        </div>
      ) : (
        <div>
          <IdleDays idleDays={idleDays} />
          <NextPenalty nextPenalty={nextPenalty} />
        </div>
      )}
    </div>
  );
};

const StreakDays = ({ currentStreakDays }: { currentStreakDays: number }) => {
  // 1 日の場合は、「連続１日」とは表示しない
  if (currentStreakDays < 2) return null;
  return (
    <div>
      <span>目前已經連續練習了</span>
      <span className='font-bold text-gray-700 text-base px-1'>
        {currentStreakDays}
      </span>
      <span>天。</span>
      {currentStreakDays > 2 && <span>太棒了！</span>}
    </div>
  );
};

const IdleDays = ({ idleDays }: { idleDays: number }) => {
  if (!idleDays) return <span>今天還沒練習喔。</span>;
  return (
    <>
      <span>目前已經</span>
      <span className='font-bold text-gray-700 text-base px-1'>
        {idleDays + 1}
      </span>
      <span className='pr-1'>天 沒有練習了。</span>
    </>
  );
};

const NextPenalty = ({ nextPenalty }: { nextPenalty: number }) => {
  return (
    <>
      <span>若持續未練習，將會扣</span>
      <span className='font-bold text-gray-700 text-base px-1'>
        {nextPenalty}
      </span>
      <span>分。</span>
    </>
  );
};
