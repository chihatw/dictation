#!/usr/bin/env bash

# このスクリプトは ~/.pgpass を使って自動認証する
# DATABASE_URL にパスワードは書かない
# pg_dump / psql → libpq → ~/.pgpass を自動参照
# ~/.pgpass 形式: hostname:port:database:username:password
# 権限が 600 でないと無効になる → chmod 600 ~/.pgpass

set -euo pipefail

set -a
source .env.local
set +a

: "${DATABASE_URL:?DATABASE_URL is not set}"

pg_dump "$DATABASE_URL" \
  --schema-only \
  --no-owner --no-privileges \
  --schema=public \
| sed -n '/^CREATE TABLE public\.dictation_/,/^);/p' \
> supabase/schema/dictation_tables.sql
