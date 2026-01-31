#!/usr/bin/env bash
pg_dump "$DATABASE_URL" \
  --schema-only \
  --no-owner --no-privileges \
  --schema=public \
  | sed -n '/^CREATE VIEW public\.dictation_/,/;$/p' \
  > supabase/schema/dictation_views.sql
