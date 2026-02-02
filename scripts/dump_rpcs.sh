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

psql "$DATABASE_URL" -Atc "
select '--- '||n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')' || E'\n'
     || pg_get_functiondef(p.oid) || E'\n'
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname='public'
order by 1;
" > supabase/rpcs/all_public_rpcs.sql
