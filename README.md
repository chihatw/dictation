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
