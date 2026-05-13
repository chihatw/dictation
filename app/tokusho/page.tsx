import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | Lang Gym 日語私人教練',
};

export default function TokushoPage() {
  return (
    <main className='mx-auto max-w-2xl px-6 py-12'>
      <h1 className='text-2xl font-bold mb-8'>特定商取引法に基づく表記</h1>

      <dl className='space-y-6 text-sm leading-relaxed'>
        <div>
          <dt className='font-semibold'>販売業者</dt>
          <dd>
            個人事業主
            <br />
            氏名は請求があった場合、特定商取引法に基づき遅滞なく開示いたします。
            <br />
          </dd>
        </div>

        <div>
          <dt className='font-semibold'>所在地</dt>
          <dd>
            請求があった場合、特定商取引法に基づき遅滞なく開示いたします。
          </dd>
        </div>

        <div>
          <dt className='font-semibold'>電話番号</dt>
          <dd>
            請求があった場合、特定商取引法に基づき遅滞なく開示いたします。
          </dd>
        </div>

        <div>
          <dt className='font-semibold'>お問い合わせ先</dt>
          <dd>langgym@outlook.com</dd>
        </div>

        <div>
          <dt className='font-semibold'>サービス名</dt>
          <dd>Lang Gym 日語私人教練</dd>
        </div>

        <div>
          <dt className='font-semibold'>サービス内容</dt>
          <dd>オンライン日本語プライベートレッスン（60分/回）</dd>
        </div>

        <div>
          <dt className='font-semibold'>販売価格</dt>
          <dd>1レッスン 600NTD（税込）</dd>
        </div>

        <div>
          <dt className='font-semibold'>料金以外の費用</dt>
          <dd>
            お客様側のインターネット接続・通信費用はお客様のご負担となります。
          </dd>
        </div>

        <div>
          <dt className='font-semibold'>支払方法</dt>
          <dd>クレジットカード決済（Stripe）</dd>
        </div>

        <div>
          <dt className='font-semibold'>支払時期</dt>
          <dd>レッスン終了後、Stripe を通じて請求いたします。</dd>
        </div>

        <div>
          <dt className='font-semibold'>サービス提供時期</dt>
          <dd>予約確定後、指定の日時にオンラインにてレッスンを実施します。</dd>
        </div>

        <div>
          <dt className='font-semibold'>返品・キャンセルについて</dt>
          <dd>
            入金後の返金には対応しておりません。
            <br />
            キャンセル・日程変更をご希望の場合は、事前にご連絡ください。
          </dd>
        </div>

        <div>
          <dt className='font-semibold'>動作環境</dt>
          <dd>
            安定したインターネット接続、 カメラ・マイク付きデバイス、 Google
            Meet を利用可能な環境。
          </dd>
        </div>
      </dl>
      <div className='pt-8 text-sm text-neutral-500'>
        <Link href='/' className='underline underline-offset-2'>
          Lang Gym トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
