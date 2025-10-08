import ArticlePanel from '../ArticlePanel';

const CLOZE: {
  title: string;
  items: {
    parts: { t: 'text' | 'blank'; v: string }[];
  }[];
}[] = [
  {
    title: '合菜N5 超簡單版',
    items: [
      {
        parts: [
          { t: 'blank', v: 'ボランティアの人' },
          { t: 'text', v: '-志工' },
        ],
      },
      {
        parts: [
          { t: 'text', v: '名詞與名詞連在一起要加' },
          { t: 'blank', v: 'の' },
        ],
      },
      {
        parts: [
          { t: 'text', v: '町の人' },
          { t: 'text', v: 'は「' },
          { t: 'text', v: 'ありがとう' },
          { t: 'text', v: '」' },
          { t: 'blank', v: 'と' },
          { t: 'text', v: '小さく言いました。' },
        ],
      },
      {
        parts: [
          { t: 'blank', v: 'と' },
          { t: 'text', v: '代表引用,又出現了' },
        ],
      },
    ],
  },
  {
    title: '合菜N5 簡單版',
    items: [
      {
        parts: [
          { t: 'text', v: '寫完要' },
          { t: 'blank', v: '思考' },
          { t: 'text', v: '語意,音對但' },
          { t: 'blank', v: '意思' },
          { t: 'text', v: '不對,要用腦' },
          { t: 'blank', v: '思考' },
        ],
      },
    ],
  },
  {
    title: '合菜N5',
    items: [
      {
        parts: [
          { t: 'text', v: '邊' },
          { t: 'blank', v: '聽' },
          { t: 'text', v: '邊' },
          { t: 'blank', v: '寫' },
          { t: 'text', v: ',有時會' },
          { t: 'blank', v: '寫錯' },
          { t: 'text', v: ',太' },
          { t: 'blank', v: '粗心' },
          { t: 'text', v: '了' },
        ],
      },
    ],
  },
  {
    title: '合菜N4',
    items: [
      {
        parts: [
          { t: 'text', v: '一直' },
          { t: 'blank', v: '聽' },
          { t: 'text', v: '一直' },
          { t: 'blank', v: '聽' },
          { t: 'text', v: '然後' },
          { t: 'blank', v: '查' },
          { t: 'text', v: '聽的出來卻' },
          { t: 'blank', v: '不懂' },
          { t: 'text', v: '的單字,' },
          { t: 'text', v: '加油' },
          { t: 'text', v: '~' },
        ],
      },
    ],
  },
  {
    title: '合菜N3',
    items: [
      {
        parts: [
          { t: 'text', v: 'が' },
          { t: 'text', v: '、' },
          { t: 'text', v: 'を' },
          { t: 'text', v: ' 要以整段句子協助' },
          { t: 'blank', v: ' 判斷' },
        ],
      },
    ],
  },
];

export default function Page() {
  return (
    <main className='min-h-screen w-full bg-gray-50 mt-10'>
      <div className='mx-auto max-w-screen-2xl p-6 lg:p-8'>
        <div className='flex flex-col gap-6'>
          {CLOZE.map((a) => (
            <ArticlePanel key={a.title} title={a.title} items={a.items} />
          ))}
        </div>
      </div>
    </main>
  );
}
