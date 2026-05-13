// app/tokushoho/page.tsx  （または pages/tokushoho.tsx）
// 特定商取引法に基づく表記 – Lang Gym 日語私人教練

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | Lang Gym 日語私人教練',
  robots: 'noindex',
};

const rows: { label: string; value: React.ReactNode }[] = [
  {
    label: '販売業者',
    value: '個人事業主（氏名は請求書・お問い合わせ時に開示します）',
  },
  {
    label: '所在地',
    value: '請求書・お問い合わせ時に開示します',
  },
  {
    label: '電話番号',
    value: '請求書・お問い合わせ時に開示します',
  },
  {
    label: 'メールアドレス',
    value: (
      <a
        href='mailto:contact@langgym.example.com'
        className='underline underline-offset-2'
      >
        contact@langgym.example.com
      </a>
    ),
  },
  {
    label: 'サービス名',
    value: 'Lang Gym 日語私人教練',
  },
  {
    label: 'サービス内容',
    value: 'オンライン日本語プライベートレッスン（60 分 / 回）',
  },
  {
    label: '販売価格',
    value: '1 レッスン 600 NTD（税込）',
  },
  {
    label: '料金以外の費用',
    value: 'お客様側のインターネット接続・通信費用はお客様のご負担となります。',
  },
  {
    label: '支払方法',
    value: 'クレジットカード決済（Stripe）',
  },
  {
    label: '支払時期',
    value:
      '後払い。各レッスン終了後に請求書を発行し、受領後 7 日以内にお支払いください。',
  },
  {
    label: 'サービス提供時期',
    value: '予約確定後、指定の日時にオンラインにてレッスンを実施します。',
  },
  {
    label: '返品・キャンセルについて',
    value: (
      <>
        <p>
          デジタルサービスの性質上、レッスン実施後の返金はお受けできません。
        </p>
        <p className='mt-1'>
          レッスン開始 24 時間前までのキャンセルは無料です。
          それ以降のキャンセル・無断欠席の場合は料金全額を申し受けます。
        </p>
      </>
    ),
  },
  {
    label: '動作環境',
    value:
      '安定したインターネット接続、カメラ・マイク付きデバイス、および Zoom またはその他指定ビデオ通話ツール。',
  },
];

export default function TokushohoPage() {
  return (
    <main className='min-h-screen bg-[#f7f5f0] px-4 py-16 font-sans text-[#1a1a1a]'>
      {/* ── ページヘッダー ── */}
      <header className='mx-auto mb-12 max-w-2xl border-b border-[#1a1a1a]/20 pb-6'>
        <p className='mb-1 text-xs uppercase tracking-[0.2em] text-[#666]'>
          Lang Gym 日語私人教練
        </p>
        <h1
          className='text-2xl font-semibold leading-snug tracking-tight'
          style={{ fontFamily: "'Noto Serif JP', Georgia, serif" }}
        >
          特定商取引法に基づく表記
        </h1>
      </header>

      {/* ── テーブル ── */}
      <section className='mx-auto max-w-2xl'>
        <dl className='divide-y divide-[#1a1a1a]/10 rounded-lg border border-[#1a1a1a]/10 bg-white shadow-sm'>
          {rows.map(({ label, value }) => (
            <div
              key={label}
              className='grid grid-cols-[9rem_1fr] gap-4 px-5 py-4 sm:grid-cols-[11rem_1fr]'
            >
              <dt className='shrink-0 text-sm font-medium text-[#555]'>
                {label}
              </dt>
              <dd className='text-sm leading-relaxed text-[#1a1a1a]'>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <p className='mt-8 text-xs leading-relaxed text-[#888]'>
          ※ 特定商取引法第 11 条に基づき、電話番号・住所等の一部情報は
          請求書またはメールにてご確認いただけます（消費者庁ガイドライン準拠）。
        </p>
      </section>
    </main>
  );
}
