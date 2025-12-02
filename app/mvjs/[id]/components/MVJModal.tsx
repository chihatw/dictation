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
          關於這項活動
        </h2>
        <section className='text-sm leading-4 p-5 space-y-4 font-light tracking-wide'>
          <p>
            我們要閱讀「過去留給未來的自己、可以用在對話上的日語」，也就是學習日誌。
          </p>

          <ol className='list-decimal pl-6 space-y-2'>
            <li>重新閱讀自己的學習日誌。</li>
            <li>
              選出你認為「最能用在真實對話中使用的內容」為 「
              <span className='marker-underline-yellow'>最佳作品</span>」。
              若還有覺得能派上用場的內容，可標為 「
              <span className='marker-underline-yellow'>佳作</span>」。
            </li>
            <li>
              使用 AI 生成一張圖片，「
              <span className='marker-underline-yellow'>
                你會在什麼情境、對誰說出這句日語
              </span>
              」的畫面， 並上傳圖片。
              <span className='marker-underline-yellow'>
                不是內容本身的畫面
              </span>
              。
            </li>
            <li>
              說明這篇「
              <span className='marker-underline-yellow'>最佳作品</span>
              」在什麼場景、對誰可以使用。
            </li>
          </ol>

          <div className='rounded-md border bg-slate-50 p-3'>
            <div className='mb-1 flex'>評選基準</div>
            <div className='flex'>
              <div className='font-extrabold tracking-tighter text-base'>
                能清楚想像「自己在什麼情境、對誰說出這句日語」。
              </div>
            </div>
          </div>

          <p>希望你學到的日語，不只是知識，而是能在生活中運用的能力。</p>

          <div className='pt-2 border-t'>
            <div className='mb-2'>例）</div>
            <ul className='list-disc pl-6 space-y-1.5'>
              <li>在被朋友介紹時，能向第一次見面的人打招呼。</li>
              <li>在餐廳用餐時，能對店員追加點餐。</li>
              <li>在和朋友聊天時，能表達自己的心情。</li>
              <li>在看到需要幫助的人時，能主動上前說話。</li>
              <li>在旅行結束後，能向日本人分享旅行中看到的事物。</li>
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
