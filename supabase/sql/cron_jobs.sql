-- dictation daily close job
-- Runs at 00:00 Asia/Taipei (16:00 UTC)
select cron.alter_job(
  2,
  schedule => '0 16 * * *',
  command => $$
    select public.dictation_close_day(
      ((now() at time zone 'Asia/Taipei')::date - 1)
    );
  $$
);
