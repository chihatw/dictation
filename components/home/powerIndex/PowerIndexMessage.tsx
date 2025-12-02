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
          請保持這個節奏，每天都持續一點點就很好。
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

const getCheerMessage = (days: number) => {
  if (days >= 3 && days < 5) return '太棒了！';
  if (days >= 5 && days < 7) return '超有毅力！';
  if (days >= 7 && days < 14) return '一週紀念！堅持就是勝利！';
  if (days >= 14 && days < 21) return '突破極限！真的很佩服！';
  if (days >= 21 && days < 30) return '形成習慣了！了不起！';
  if (days >= 30 && days < 50) return '30天傳說達成！太感動了！';
  if (days >= 50 && days < 100) return '驚人的堅持！你是模範！';
  if (days >= 100) return '百日傳奇！敬佩！！';
  return null;
};

const StreakDays = ({ currentStreakDays }: { currentStreakDays: number }) => {
  const message = getCheerMessage(currentStreakDays);

  // 1 日の場合は、「連続１日」とは表示しない
  if (currentStreakDays < 2) return null;
  return (
    <div>
      <span>目前已經連續練習了</span>
      <span className='font-bold text-gray-700 text-base px-1'>
        {currentStreakDays}
      </span>
      <span>天。</span>
      {message && <span className='ml-1'>{message}</span>}
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
