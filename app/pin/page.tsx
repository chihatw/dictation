import { JournalPicker } from './JournalPicker';

const items = [
  {
    id: 'a1',
    title: '10月1日',
    excerpt: '文法の復習。〜と思うの使い方を整理。'.repeat(2),
  },
  {
    id: 'a2',
    title: '10月2日',
    excerpt: '聞き取り練習。速い会話が難しい。'.repeat(3),
  },
  {
    id: 'a3',
    title: '10月3日',
    excerpt: '語彙を20語暗記。例文も併せて学習。'.repeat(4),
  },
  {
    id: 'a4',
    title: '10月4日',
    excerpt: 'ニュースを小声でシャドーイング。滑らかさを意識。'.repeat(5),
  },
  {
    id: 'a5',
    title: '10月5日',
    excerpt: '漢字ドリル。覚えた端から忘れる。繰り返しが必要。'.repeat(6),
  },
  {
    id: 'a6',
    title: '10月6日',
    excerpt: '日記を書いた。助詞の誤りが多い。推敲を増やしたい。'.repeat(3),
  },
  {
    id: 'a7',
    title: '10月7日',
    excerpt: '接続詞の整理。だから。しかし。けれど。場面を意識。'.repeat(7),
  },
  {
    id: 'a8',
    title: '10月8日',
    excerpt: '短いポッドキャストを反復再生して耳慣らし。'.repeat(2),
  },
  {
    id: 'a9',
    title: '10月9日',
    excerpt: '読解問題。指示語の参照に苦戦。少しずつ慣れる。'.repeat(5),
  },
  {
    id: 'a10',
    title: '10月10日',
    excerpt:
      'アニメを字幕付きで視聴。未知表現をメモ。音と文字の対応を意識。'.repeat(
        8
      ),
  },
  {
    id: 'a11',
    title: '10月11日',
    excerpt: '作文添削。語順を直した。もっと自然な言い回しを目標。'.repeat(4),
  },
  {
    id: 'a12',
    title: '10月12日',
    excerpt:
      'JLPT模試。時間配分に課題あり。パートごとの優先順位を検討。'.repeat(6),
  },
  {
    id: 'a13',
    title: '10月13日',
    excerpt: '友人と会話。言いよどみ多いが実践が大事。'.repeat(3),
  },
  {
    id: 'a14',
    title: '10月14日',
    excerpt: '敬語の整理。尊敬語と謙譲語の違い。'.repeat(2),
  },
  {
    id: 'a15',
    title: '10月15日',
    excerpt: '語彙アプリで復習。弱点単語を抽出して重点掲載。'.repeat(7),
  },
  {
    id: 'a16',
    title: '10月16日',
    excerpt: '短文翻訳。直訳癖を抑える訓練。'.repeat(9),
  },
  {
    id: 'a17',
    title: '10月17日',
    excerpt: '朗読。アクセント位置が不安定。録音して確認。'.repeat(5),
  },
  {
    id: 'a18',
    title: '10月18日',
    excerpt: '接頭辞と接尾辞の理解で語彙拡張。例を集めて整理。'.repeat(10),
  },
  {
    id: 'a19',
    title: '10月19日',
    excerpt: 'ラジオ講座。聞き逃しを再視聴。ほんの少し理解が増えた。'.repeat(3),
  },
  {
    id: 'a20',
    title: '10月20日',
    excerpt: '作文。主題を一つに絞る練習。論理構成を意識。'.repeat(12),
  },
];

export default function Page() {
  return <JournalPicker items={items} />;
}
