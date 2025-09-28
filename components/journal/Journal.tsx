type Props = {
  body: string;
  created_at: string;
};

const Journal = ({ body, created_at }: Props) => {
  const date = new Date(created_at);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return (
    <div className='bg-slate-50 p-2 rounded-md my-2 text-xs border border-slate-200'>
      <div className='flex gap-x-2 items-center'>
        <div className='font-bold'>學習日誌</div>
        <div>
          <div className='text-slate-500'>{[y, m, d].join('/')}</div>
        </div>
      </div>
      <div className='px-2 text-slate-700'>
        {body.split('\n').map((line, index) => {
          return <div key={index}>{line}</div>;
        })}
      </div>
    </div>
  );
};

export default Journal;
