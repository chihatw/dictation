AI によるディクテーション添削

### 日次処理あり

台湾時間の「前日」を締めるために、毎日 pg_cron ジョブを実行している。

- 目的: ディクテーション提出状況を確定し、パワーインデックスを更新する
- 基準タイムゾーン: Asia/Taipei
- 実行時刻: 台湾時間 00:00（UTC 16:00）
- 対象日: 台湾時間の「昨日」

Cron schedule (UTC):

```shell
0 16 * * *
```

Command:

```sql
select public.dictation_close_day(
  ((now() at time zone 'Asia/Taipei')::date - 1)
);
```

### Netlify で Stripe を利用するための工夫

Vercel と Netlify でデプロイ
Stripe 導入において、Vercel Free では商用利用不可のため、Netlify Free を利用することにした。
また、Netlify では Google Cloud TTS の環境変数が4KBの上限を超え設定できないため、以下のように分けることにした。

- Vercel: Google Cloud TTS（管理者用）
- Netlify: Stripe（ユーザー用）

main ブランチに push された際

- Vercel ではそのままデプロイ
- Netlify では何もされない

Netlify のデプロイは、production ブランチに push された際に行うことにする。
運営方法は

- main ブランチで開発
- base production, compare main で Pull Request を作成すると、Netlify が Deploy Preview を作成
- Pull Request をマージすると、Netlify が production ブランチをデプロイ

- Deploy Preview は無制限
- Deploy は1回15クレジット。Netlify Free では月300クレジットまで。
