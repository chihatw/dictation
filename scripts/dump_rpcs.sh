#!/usr/bin/env bash
psql "$DATABASE_URL" -Atc "
select '--- '||n.nspname||'.'||p.proname||'('||pg_get_function_identity_arguments(p.oid)||')' || E'\n'
     || pg_get_functiondef(p.oid) || E'\n'
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname='public'
order by 1;
" > supabase/rpcs/all_public_rpcs.sql
