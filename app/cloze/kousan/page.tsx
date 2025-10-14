import { ClozeLine } from '@/types/dictation';
import ArticleCloze from '../ArticleCloze';

const CLOZE: {
  title: string;
  lines: ClozeLine[];
}[] = [
  {
    title: '合菜N5',
    lines: [
      [
        { t: 'text', v: '1. ' },
        { t: 'blank', v: '次々と' },
        { t: 'text', v: '出ます：蟻が蟻の巣から' },
        { t: 'blank', v: '次々と' },
        { t: 'text', v: '出てきます。' },
      ],
      [
        { t: 'text', v: '2. ' },
        { t: 'blank', v: 'いっぱい' },
        { t: 'text', v: 'になりました：お腹が' },
        { t: 'blank', v: 'いっぱい' },
        { t: 'text', v: 'になりました。' },
      ],
      [
        { t: 'text', v: '3. ' },
        { t: 'text', v: 'お腹が重くて、歩く' },
        { t: 'blank', v: 'のも大変でした' },
        { t: 'text', v: '：頭が痛くて、仕事する' },
        { t: 'blank', v: 'のも大変でした' },
        { t: 'text', v: '。' },
      ],
    ],
  },
  {
    title: '合菜N4',
    lines: [
      [
        { t: 'text', v: '1. ' },
        { t: 'blank', v: '集まる' },
        { t: 'text', v: '(学生が' },
        { t: 'blank', v: '集まった' },
        { t: 'text', v: ')．' },
        { t: 'blank', v: '集める' },
        { t: 'text', v: '(切手を' },
        { t: 'blank', v: '集める' },
        { t: 'text', v: ')' },
      ],
      [
        { t: 'text', v: '2. 肉料理のないテーブルには' },
        { t: 'text', v: '：' },
        { t: 'text', v: '前面沒講過，所以是分類（？）' },
      ],
      [
        { t: 'text', v: '3. ' },
        { t: 'blank', v: '色とりどり' },
        { t: 'text', v: 'の果物/花/飴' },
      ],
      [
        { t: 'text', v: '4. ' },
        { t: 'blank', v: '山' },
        { t: 'text', v: 'のように' },
      ],
      [
        { t: 'text', v: '5. 4人では' },
        {
          t: 'text',
          v: '：で是範圍、は前面因為講過四人，所以在這裡是主題(?)',
        },
      ],
      [
        { t: 'text', v: '6. ' },
        { t: 'blank', v: '立ち上がる' },
        { t: 'text', v: '站起來　' },
        { t: 'text', v: 'ゆっくりと' },
        { t: 'blank', v: '立ち上がる' },
        { t: 'text', v: '慢慢地站起來' },
      ],
    ],
  },
  {
    title: '合菜N3',
    lines: [
      [
        { t: 'text', v: '1. ' },
        { t: 'blank', v: '〜てきて' },
        {
          t: 'text',
          v: '(〜てくる某種狀態／動作往自己這邊來、逐漸出現)：記憶が',
        },
        { t: 'blank', v: '湧いてきて' },
        { t: 'text', v: '   友達が' },
        { t: 'blank', v: '走ってきて' },
      ],
      [
        { t: 'text', v: '2. ' },
        { t: 'blank', v: '山盛りの〜' },
        { t: 'text', v: '：如山一般的〜' },
      ],
      [
        { t: 'text', v: '3. お皿が並べられる' },
        { t: 'blank', v: 'たびに' },
        { t: 'text', v: '：每次擺上桌的時候。 飴を食べる' },
        { t: 'blank', v: 'たびに' },
        { t: 'text', v: '幸せを感じる' },
      ],
      [
        { t: 'text', v: '4. ' },
        { t: 'blank', v: '〜きれず' },
        { t: 'text', v: '：〜不完。 讀不完/' },
        { t: 'blank', v: '読みきれない' },
        { t: 'text', v: '　寫不完/' },
        { t: 'blank', v: '書ききれない' },
        { t: 'text', v: '　數不清/' },
        { t: 'blank', v: '数えきれない' },
      ],
    ],
  },
  {
    title: '合菜N2',
    lines: [
      [
        { t: 'text', v: '1. ' },
        { t: 'blank', v: '円卓' },
        { t: 'text', v: '：圓桌  ' },
        { t: 'blank', v: '円卓会議' },
      ],
      [
        { t: 'text', v: '2. ' },
        { t: 'blank', v: '〜を含めて' },
        { t: 'text', v: '：包含～在內 税金を' },
        { t: 'blank', v: '含めて' },
        { t: 'text', v: '、三万元を払った。' },
      ],
      [
        { t: 'text', v: '3. ' },
        { t: 'blank', v: '〜事情に関係なく' },
        { t: 'text', v: '：不管狀況如何' },
      ],
      [
        { t: 'text', v: '4. ' },
        { t: 'blank', v: '到底' },
        { t: 'text', v: '＝どうしても／まったく／全然～できない' },
      ],
      [
        { t: 'text', v: '5. ' },
        { t: 'blank', v: 'はち切れ' },
        { t: 'text', v: '：要裂開、快要爆開' },
      ],
      [
        { t: 'text', v: '6. ' },
        { t: 'blank', v: '〜さえ' },
        { t: 'text', v: '：連～　猛暑日には外に出るの' },
        { t: 'blank', v: 'さえ' },
        { t: 'text', v: '辛いです。' },
      ],
    ],
  },
  {
    title: '合菜N1',
    lines: [
      [
        { t: 'text', v: '1. ' },
        { t: 'blank', v: '夕食を囲んだ' },
        { t: 'text', v: '：圍著晚餐一起吃   テーブルを' },
        { t: 'blank', v: '囲んで' },
        { t: 'text', v: '問題を考えた。' },
      ],
      [
        { t: 'text', v: '2. ' },
        { t: 'blank', v: '容赦なく' },
        { t: 'text', v: '：毫不留情地' },
      ],
      [
        { t: 'text', v: '3. ' },
        { t: 'blank', v: '瞬くまに' },
        { t: 'text', v: '：瞬間' },
      ],
      [
        { t: 'text', v: '4. ' },
        { t: 'blank', v: '埋め尽く' },
        { t: 'text', v: '：填滿  花蓮の街は土石流で' },
        { t: 'blank', v: '瞬くまに埋め尽くされた' },
        { t: 'text', v: '。' },
      ],
      [
        { t: 'text', v: '5. ' },
        { t: 'blank', v: '〜張り裂けそうになる' },
        { t: 'text', v: '：快要爆開、撐破　長時間パソコンを使って、頭が' },
        { t: 'blank', v: '張り裂けそうになった' },
        { t: 'text', v: '。' },
      ],
      [
        { t: 'text', v: '6. ' },
        { t: 'blank', v: '太刀打ち' },
        { t: 'text', v: '：抗衡　　' },
        { t: 'blank', v: '太刀打ちできなかった' },
        { t: 'text', v: '：無法抗衡' },
      ],
      [
        { t: 'text', v: '7. ' },
        { t: 'blank', v: 'を平らげる' },
        { t: 'text', v: '：全部消耗掉　私たちはピザを全部' },
        { t: 'blank', v: '平らげてしまった' },
        { t: 'text', v: '。' },
      ],
      [
        { t: 'text', v: '8. ' },
        { t: 'blank', v: '帰路についた' },
        { t: 'text', v: '：啟程回家' },
      ],
    ],
  },
];

export default function Page() {
  return (
    <main className='min-h-screen w-full bg-gray-50 mt-10'>
      <div className='mx-auto max-w-screen-2xl p-6 lg:p-8'>
        <div className='flex flex-col gap-6'>
          {CLOZE.map((a) => (
            <ArticleCloze key={a.title} title={a.title} lines={a.lines} />
          ))}
        </div>
      </div>
    </main>
  );
}
