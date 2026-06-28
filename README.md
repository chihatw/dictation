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

### 認証・認可の書き方

このアプリは基本的に Default Allow とし、認証が必要な画面・API・Server Action 側で明示的に拒否する。
未ログインユーザーや権限のないユーザーには、リダイレクトではなく 404 を見せる。

#### proxy.ts

`proxy.ts` は認可判定の主担当にしない。

- `/signin` でログイン済みユーザーを `/` にリダイレクトする
- 認証対象ページ/API では Supabase セッションをリフレッシュする
- 未ログインユーザーを `/signin` にリダイレクトしない
- admin 以外を `/` にリダイレクトしない

認証が必要な pathname を追加した場合は、セッション更新のため `proxy.ts` の対象にも追加する。

#### 認証が必要なページ

認証が必要な page 配下には `layout.tsx` を置き、`requireUser()` を呼ぶ。

```tsx
import { requireUser } from '@/lib/auth/guards';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireUser();

  return children;
}
```

ページ内で user や supabase client も必要な場合は、page 側で同じ helper を使う。
`requireUser()` は RSC 用に `cache()` されているため、同一リクエスト内で layout と page の両方から呼んでも結果が再利用される。

```tsx
const { supabase, user } = await requireUser();
```

#### 管理者限定ページ

管理者限定の page 配下には `layout.tsx` を置き、`requireAdmin()` を呼ぶ。
`requireAdmin()` も RSC 用に `cache()` されている。

```tsx
import { requireAdmin } from '@/lib/auth/guards';

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdmin();

  return children;
}
```

#### Server Action

Server Action は実質 POST endpoint として直叩きできるため、必ず action 内で認証・認可を確認する。
`requireUserAction()` / `requireAdminAction()` はキャッシュせず、action 実行ごとに確認する。

認証ユーザー向け:

```ts
'use server';

import { requireUserAction } from '@/lib/auth/guards';

export async function someAction() {
  const { supabase, user } = await requireUserAction();

  // user.id を使って本人のデータだけを操作する
}
```

管理者限定:

```ts
'use server';

import { requireAdminAction } from '@/lib/auth/guards';

export async function someAdminAction() {
  const { supabase } = await requireAdminAction();

  // admin のみ実行できる処理
}
```

#### API Route Handler

API は Route Handler 内で明示的に判定し、権限がなければ 404 を返す。

認証ユーザー向け:

```ts
const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return new Response(null, { status: 404 });
}
```

管理者限定:

```ts
if (user?.app_metadata?.role !== 'admin') {
  return new Response(null, { status: 404 });
}
```

#### 現在のポリシー

- 一般公開: `/`, `/dev`, `/signin`, `/tokusho`
- 認証ユーザー: `/articles`, `/assignments`, `/cloze`, `/mvjs`, `/payments`, `/api/chat`
- 管理者限定: `/admin`, `/api/tags`, `/api/tts`
