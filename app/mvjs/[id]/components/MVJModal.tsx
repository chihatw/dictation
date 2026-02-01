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
            回頭看看自己寫過的學習日誌吧！
            <br />
            不回頭整理一下，很快就會忘記，寫了就等於白寫。
          </p>

          <ol className='list-decimal pl-6 space-y-2'>
            <li>重新閱讀自己的學習日誌。</li>
            <li>
              選出你認為「最能讓對方感受到你的心意、能縮短彼此距離的內容」為「
              <span className='marker-underline-yellow'>最佳作品</span>
              」。若還有覺得在真實對話中也能自然說出口的內容，可標為「
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
                能清楚想像「自己想把這句話對誰說、說出口時能讓彼此距離變近的情境」。
              </div>
            </div>
          </div>

          <p>希望你學到的日語，是能真正用來與人交流心意的話語。</p>
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
