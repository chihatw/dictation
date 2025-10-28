export const MVJModal = ({
  dontShowAgain,
  closeIntro,
  setDontShowAgain,
}: {
  closeIntro: () => void;
  dontShowAgain: boolean;
  setDontShowAgain: (checked: boolean) => void;
}) => {
  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'
      onClick={closeIntro}
    >
      <div
        className='w-120 max-w-[90%] max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-extrabold px-4 py-4 bg-slate-800 text-white'>
          關於這個活動
        </h2>
        <section className='text-sm leading-4 p-5 space-y-4 font-light tracking-wide'>
          <p>
            我們要閱讀過去留給未來的自己、可以用在對話上的日語，也就是學習日誌。
          </p>

          <ol className='list-decimal pl-6 space-y-2'>
            <li>重新閱讀自己的學習日誌。</li>
            <li>
              選出你認為「最能用在對話中」的內容為 「
              <span className='marker-underline-yellow'>最佳作品</span>」。
              若還有覺得能派上用場的內容，可標為 「
              <span className='marker-underline-yellow'>佳作</span>」；
              若沒有，也
              <span className='marker-underline-yellow'>可以不選</span>。
            </li>
            <li>
              <span className='marker-underline-yellow'>寫下理由</span>：
              為什麼選這篇，或為什麼這次沒有選。
            </li>
          </ol>

          <div className='rounded-md border bg-slate-50 p-3'>
            <div className='mb-1 flex'>評選基準</div>
            <div className='flex'>
              <div className='font-extrabold tracking-tighter text-base'>
                能清楚想像自己在什麼情境使用。
              </div>
            </div>
          </div>

          <p>期望你學到的日語，不只是知識，而是能在現實中使用的工具。</p>

          <div className='pt-2 border-t'>
            <div className='mb-2'>例）</div>
            <ul className='list-disc pl-6 space-y-1.5'>
              <li>能和第一次見面的人打招呼</li>
              <li>對店員能追加點餐</li>
              <li>能向朋友表達自己的心情</li>
              <li>能主動對需要幫助的人說話</li>
              <li>能向日本人介紹旅行中看到的事物</li>
            </ul>
          </div>
        </section>
        <div className='px-4 flex'>
          <label className='flex items-center gap-2 text-xs px-4 bg-slate-50 border py-2 rounded-full'>
            <input
              type='checkbox'
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
            />
            下次不再顯示
          </label>
        </div>

        <div className='flex justify-end gap-2 px-4 pb-4'>
          <button
            onClick={closeIntro}
            className='rounded bg-black px-3 py-1 text-white text-sm'
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};
