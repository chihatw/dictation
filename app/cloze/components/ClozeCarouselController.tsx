import { RotateCcw } from 'lucide-react';

type Props = {
  isJournalUnit: boolean;
  isSeqOrder: boolean;
  handleReset: () => void;
  setJournalUnit: () => void;
  setLineUnit: () => void;
  setSeqOrder: () => void;
  setRandomOrder: () => void;
};

const ClozeCarouselController = ({
  isJournalUnit,
  isSeqOrder,
  handleReset,
  setJournalUnit,
  setLineUnit,
  setSeqOrder,
  setRandomOrder,
}: Props) => {
  return (
    <div className='flex items-center justify-between gap-2'>
      <div className='flex items-center gap-2'>
        {/* 単位切替 */}
        <div className='inline-flex rounded-lg border p-1'>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              isJournalUnit ? 'bg-slate-900 text-white' : 'text-slate-700'
            }`}
            onClick={setJournalUnit}
          >
            以日誌顯示
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              !isJournalUnit ? 'bg-slate-900 text-white' : 'text-slate-700'
            }`}
            onClick={setLineUnit}
          >
            以行顯示
          </button>
        </div>
        {/* 並び切替（行単位時のみ） */}
        {!isJournalUnit && (
          <div className='inline-flex rounded-lg border p-1'>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                isSeqOrder ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
              onClick={setSeqOrder}
            >
              依序播放
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${
                !isSeqOrder ? 'bg-slate-900 text-white' : 'text-slate-700'
              }`}
              onClick={setRandomOrder}
            >
              隨機播放
            </button>
          </div>
        )}
      </div>

      <button
        className='bg-white rounded p-2 border hover:bg-slate-50 cursor-pointer'
        onClick={handleReset}
        aria-label='最初に戻る'
        title='最初に戻る'
      >
        <RotateCcw className='h-4 w-4' />
      </button>
    </div>
  );
};

export default ClozeCarouselController;
