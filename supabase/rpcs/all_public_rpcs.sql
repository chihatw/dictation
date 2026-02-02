--- public.create_feedback_and_log(p_sentence_id uuid, p_answer text, p_ai_feedback_md text, p_plays_count integer, p_elapsed_ms_since_item_view integer, p_elapsed_ms_since_first_play integer, p_self_comp smallint)
CREATE OR REPLACE FUNCTION public.create_feedback_and_log(p_sentence_id uuid, p_answer text, p_ai_feedback_md text, p_plays_count integer, p_elapsed_ms_since_item_view integer, p_elapsed_ms_since_first_play integer, p_self_comp smallint)
 RETURNS TABLE(saved boolean, logged boolean, completed boolean, article_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
DECLARE
  v_total_cnt int;
  v_answered_cnt int;
  v_article_id uuid;
BEGIN
  IF p_self_comp NOT BETWEEN 1 AND 4 THEN
    RAISE EXCEPTION 'invalid self_assessed_comprehension';
  END IF;

  INSERT INTO public.dictation_submissions(
    sentence_id, answer, ai_feedback_md,
    plays_count, elapsed_ms_since_item_view,
    elapsed_ms_since_first_play, self_assessed_comprehension
  )
  VALUES (
    p_sentence_id, p_answer, p_ai_feedback_md,
    p_plays_count, p_elapsed_ms_since_item_view,
    p_elapsed_ms_since_first_play, p_self_comp
  )
  ON CONFLICT (sentence_id) DO UPDATE SET
    answer                      = EXCLUDED.answer,
    ai_feedback_md              = EXCLUDED.ai_feedback_md,
    plays_count                 = EXCLUDED.plays_count,
    elapsed_ms_since_item_view  = EXCLUDED.elapsed_ms_since_item_view,
    elapsed_ms_since_first_play = EXCLUDED.elapsed_ms_since_first_play,
    self_assessed_comprehension = EXCLUDED.self_assessed_comprehension;

  SELECT s.article_id INTO v_article_id
  FROM public.dictation_sentences s
  WHERE s.id = p_sentence_id;

  SELECT COUNT(*) INTO v_total_cnt
  FROM public.dictation_sentences ds
  WHERE ds.article_id = v_article_id;

  SELECT COUNT(DISTINCT dsb.sentence_id) INTO v_answered_cnt
  FROM public.dictation_submissions dsb
  JOIN public.dictation_sentences ss ON ss.id = dsb.sentence_id
  WHERE ss.article_id = v_article_id;

  RETURN QUERY SELECT true, true, (v_answered_cnt = v_total_cnt), v_article_id;
END;
$function$


--- public.delete_thumbnail_and_image(p_image_id uuid)
CREATE OR REPLACE FUNCTION public.delete_thumbnail_and_image(p_image_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  delete from pin_comment_thumbnails where image_id = p_image_id;
  delete from pin_comment_images where id = p_image_id;
end;
$function$


--- public.dictation_close_day(p_day date)
CREATE OR REPLACE FUNCTION public.dictation_close_day(p_day date DEFAULT ((now() AT TIME ZONE 'Asia/Taipei'::text))::date)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  r record;
  v_score int;
  v_has_sub bool;
  v_state public.dictation_power_index_state_t;
  v_cidle int;
  v_inserted int;

  -- p_day の Asia/Taipei 00:00〜翌00:00 を timestamptz として用意
  v_start timestamptz;
  v_end   timestamptz;
begin
  v_start := (p_day::timestamp at time zone 'Asia/Taipei');
  v_end   := ((p_day + 1)::timestamp at time zone 'Asia/Taipei');

  -- 当日提出ユーザーを事前に確定（N+1軽減・視認性優先）
  create temporary table _submitted_users(
    user_id uuid primary key
  ) on commit drop;

  insert into _submitted_users(user_id)
  select distinct v.user_id
  from public.dictation_submissions_daily_users_view v
  where v.created_at >= v_start
    and v.created_at <  v_end;

  for r in
    select *
    from public.dictation_power_indices
  loop
    v_state := r.state;
    v_score := r.current_score;

    -- 前日までの連続放置日数（なければ 0）
    select coalesce(
      (
        select d.consecutive_idle_days
        from public.dictation_power_index_daily d
        where d.user_id = r.user_id
          and d.day < p_day
        order by d.day desc
        limit 1
      ),
      0
    )
    into v_cidle;

    -- 当日提出の有無（事前集計した一時テーブルを見る）
    select exists (
      select 1
      from _submitted_users s
      where s.user_id = r.user_id
    )
    into v_has_sub;

    if v_state = 'running' then
      if v_has_sub then
        v_cidle := 0;
      else
        v_cidle := v_cidle + 1;
        v_score := v_score - public.dictation_penalty(v_cidle);
      end if;

    elsif v_state = 'paused' then
      -- 連続放置日数を増やさないが保持（何もしない）

    else
      v_cidle := 0;
    end if;

    insert into public.dictation_power_index_daily(
      user_id, day, state, score, consecutive_idle_days
    ) values (
      r.user_id, p_day, v_state, v_score, v_cidle
    )
    on conflict (user_id, day) do nothing;

    -- その日の daily を新規作成できたときだけ current_score を更新（冪等化）
    GET DIAGNOSTICS v_inserted = ROW_COUNT;

    if v_inserted = 1 then
      update public.dictation_power_indices
        set current_score = v_score
        where user_id = r.user_id;
    end if;
  end loop;
end;
$function$


--- public.dictation_count_lines(p_text text)
CREATE OR REPLACE FUNCTION public.dictation_count_lines(p_text text)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select cardinality(regexp_split_to_array(coalesce(p_text,''), E'\r?\n'))
$function$


--- public.dictation_penalty(consecutive_days integer)
CREATE OR REPLACE FUNCTION public.dictation_penalty(consecutive_days integer)
 RETURNS integer
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  select round(126.30 * exp(0.0622 * consecutive_days) - 133.40)::int
$function$


--- public.get_article_answers_for_modal(p_article_id uuid)
CREATE OR REPLACE FUNCTION public.get_article_answers_for_modal(p_article_id uuid)
 RETURNS TABLE(seq integer, content text, answer text, ai_feedback_md text)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
  SELECT
    s.seq,
    s.content,
    sub.answer,
    sub.ai_feedback_md
  FROM public.dictation_sentences AS s
  LEFT JOIN LATERAL (
    SELECT ds.answer, ds.ai_feedback_md
    FROM public.dictation_submissions AS ds
    WHERE ds.sentence_id = s.id
    ORDER BY ds.created_at DESC
    LIMIT 1
  ) AS sub ON TRUE
  WHERE s.article_id = p_article_id
  ORDER BY s.seq;
$function$


--- public.get_article_page(p_article_id uuid)
CREATE OR REPLACE FUNCTION public.get_article_page(p_article_id uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
WITH art AS (
  SELECT a.id, a.seq, a.subtitle, a.created_at, a.audio_path_full, a.assignment_id
  FROM public.dictation_articles a
  WHERE a.id = p_article_id
),
coll AS (
  SELECT c.id, c.user_id, c.title
  FROM public.dictation_assignments c
  JOIN art a ON a.assignment_id = c.id
),
sent AS (
  SELECT s.id, s.seq, s.content, s.created_at, s.audio_path
  FROM public.dictation_sentences s
  WHERE s.article_id = p_article_id
  ORDER BY s.seq ASC
)
SELECT jsonb_build_object(
  'id', a.id,
  'user_id', c.user_id,
  'assignment_id', a.assignment_id,
  'title', c.title,
  'seq', a.seq,
  'subtitle', a.subtitle,
  'created_at', a.created_at,
  'audio_path_full', a.audio_path_full,
  'journal',
    CASE WHEN j.id IS NULL THEN NULL
         ELSE jsonb_build_object(
           'id', j.id,
           'created_at', j.created_at,
           'article_id', j.article_id,
           'body', j.body,
           'rating_score', j.rating_score
         ) END,
  'sentences',
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'seq', s.seq,
          'content', s.content,
          'created_at', s.created_at,
          'audio_path', s.audio_path,
          'submission',
            CASE WHEN ds.id IS NULL THEN NULL ELSE jsonb_build_object(
              'id', ds.id,
              'answer', ds.answer,
              'ai_feedback_md', ds.ai_feedback_md,
              'teacher_feedback_md', ds.teacher_feedback_md,
              'created_at', ds.created_at,
              'self_assessed_comprehension', ds.self_assessed_comprehension,
              'plays_count', ds.plays_count,
              'elapsed_ms_since_item_view', ds.elapsed_ms_since_item_view,
              'elapsed_ms_since_first_play', ds.elapsed_ms_since_first_play,
              'tags', COALESCE((
                 SELECT jsonb_agg(
                   jsonb_build_object(
                     'id', t.id,
                     'created_at', t.created_at,
                     'tag_master_id', t.tag_master_id,
                     'label', m.label
                   )
                   ORDER BY t.created_at
                 )
                 FROM public.dictation_teacher_feedback_tags t
                 LEFT JOIN public.dictation_tag_master m ON m.id = t.tag_master_id
                 WHERE t.submission_id = ds.id
              ), '[]'::jsonb)
            ) END
        )
        ORDER BY s.seq
      )
      FROM sent s
      LEFT JOIN public.dictation_submissions ds ON ds.sentence_id = s.id
    )
)
FROM art a
JOIN coll c ON TRUE
LEFT JOIN public.dictation_journals j ON j.article_id = a.id;
$function$


--- public.get_assignment_article_tags(p_assignment_id uuid)
CREATE OR REPLACE FUNCTION public.get_assignment_article_tags(p_assignment_id uuid)
 RETURNS TABLE(id uuid, subtitle text, created_at timestamp with time zone, seq integer, tags text[], journal_body text, journal_created_at timestamp with time zone)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
WITH arts AS (
  SELECT a.id, a.subtitle, a.created_at, a.seq
  FROM public.dictation_articles a
  WHERE a.assignment_id = p_assignment_id
),
j AS (
  SELECT a.id AS article_id, jj.body, jj.created_at
  FROM arts a
  LEFT JOIN LATERAL (
    SELECT jj.body, jj.created_at
    FROM public.dictation_journals jj
    WHERE jj.article_id = a.id
    ORDER BY jj.created_at DESC
    LIMIT 1
  ) jj ON TRUE
)
SELECT
  a.id,
  a.subtitle,
  a.created_at,
  a.seq,
  COALESCE(ARRAY_AGG(DISTINCT m.label) FILTER (WHERE m.label IS NOT NULL), '{}') AS tags,
  j.body  AS journal_body,
  j.created_at AS journal_created_at
FROM arts a
LEFT JOIN j ON j.article_id = a.id
LEFT JOIN public.dictation_sentences s ON s.article_id = a.id
LEFT JOIN public.dictation_submissions sub ON sub.sentence_id = s.id
LEFT JOIN public.dictation_teacher_feedback_tags t ON t.submission_id = sub.id
LEFT JOIN public.dictation_tag_master m ON m.id = t.tag_master_id
GROUP BY a.id, a.subtitle, a.created_at, a.seq, j.body, j.created_at
ORDER BY a.seq ASC;
$function$


--- public.get_distinct_due_ym_keys()
CREATE OR REPLACE FUNCTION public.get_distinct_due_ym_keys()
 RETURNS TABLE(due_ym_key text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  select distinct due_ym_key
  from dictation_assignments_view
  where is_published = true
  order by due_ym_key desc;
$function$


--- public.get_home_more_journals(p_uid uuid, p_before timestamp with time zone, p_limit integer)
CREATE OR REPLACE FUNCTION public.get_home_more_journals(p_uid uuid, p_before timestamp with time zone, p_limit integer DEFAULT 10)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
WITH base AS (
  SELECT
    v.id,
    v.created_at,
    v.article_id,
    v.body,
    v.rating_score,
    v.cloze_spans,
    v.locked,
    v.self_award
  FROM public.dictation_journals_view v
  WHERE v.user_id = p_uid
    AND v.created_at < COALESCE(p_before, now())
  ORDER BY v.created_at DESC
  LIMIT p_limit + 1
),
page AS (
  SELECT * FROM base ORDER BY created_at DESC LIMIT p_limit
),
next_cur AS (
  SELECT MIN(created_at) AS next_before FROM page
),
has_more AS (
  SELECT (COUNT(*) > p_limit) AS more FROM base
)
SELECT jsonb_build_object(
  'items',
    COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id',           p.id,
          'created_at',   p.created_at,
          'article_id',   p.article_id,
          'body',         p.body,
          'rating_score', p.rating_score,
          'cloze_spans',  p.cloze_spans,
          'locked',       p.locked,
          'self_award',   p.self_award
        )
        ORDER BY p.created_at DESC
      )
      FROM page p
    ), '[]'::jsonb),
  'next_before', (SELECT next_before FROM next_cur),
  'has_more',    (SELECT more FROM has_more)
);
$function$


--- public.get_home_next_task(p_uid uuid)
CREATE OR REPLACE FUNCTION public.get_home_next_task(p_uid uuid)
 RETURNS TABLE(assignment_id uuid, title text, due_at timestamp with time zone, published_at timestamp with time zone, done_count integer, total_count integer, next_article_id uuid, next_sentence_id uuid, next_full_title text, next_sentence_seq integer, top_assignment_ids uuid[], mvj_id text, mvj_image_url text, mvj_reason text, mvj_title text, mvj_due_at timestamp with time zone, power_index integer, power_index_state dictation_power_index_state_t, consecutive_idle_days integer, current_streak_days integer, next_penalty integer, has_submissions boolean)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
WITH latest AS (
  SELECT 
    a.id AS assignment_id, 
    a.title,
    a.due_at, 
    a.published_at
  FROM public.dictation_assignments a
  WHERE a.user_id = p_uid
    AND a.published_at IS NOT NULL
  ORDER BY a.due_at DESC NULLS LAST
  LIMIT 1
),
nextq AS (
  SELECT
    s.assignment_id,
    s.article_id,
    s.sentence_id,
    s.full_title,
    s.sentence_seq
  FROM public.dictation_sentences_view s
  CROSS JOIN latest l
  WHERE s.assignment_id = l.assignment_id
    AND s.submission_id IS NULL
  ORDER BY s.article_seq, s.sentence_seq
  LIMIT 1
),
journal_todos AS (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'article_id', v.article_id::text,
        'full_title', v.full_title
      )
      ORDER BY v.seq
    ),
    '[]'::jsonb
  ) AS todos
  FROM public.dictation_article_journal_status_view v
  CROSS JOIN latest l
  WHERE v.assignment_id = l.assignment_id
    AND v.all_done = true
    AND v.has_journal = false
),
tops AS (
  SELECT 
    COALESCE(array_agg(x.id), '{}'::uuid[]) AS a_ids
  FROM (
    SELECT a.id
    FROM public.dictation_assignments a
    WHERE a.user_id = p_uid
      AND a.published_at IS NOT NULL
    ORDER BY a.due_at DESC NULLS LAST
    LIMIT 2
  ) x
),
mvj AS (
  SELECT id, image_url, reason, title, due_at
  FROM public.dictation_mvjs
  WHERE user_id = p_uid
    AND published_at IS NOT NULL
  ORDER BY due_at DESC
  LIMIT 1
),
pi AS (
  SELECT 
    COALESCE(current_score, 0) AS current_score,
    state AS power_index_state
  FROM public.dictation_power_indices
  WHERE user_id = p_uid
  LIMIT 1
),
latest_state AS (
  SELECT COALESCE(
    (
      SELECT d.consecutive_idle_days
      FROM public.dictation_power_index_daily d
      WHERE d.user_id = p_uid
      ORDER BY d.day DESC
      LIMIT 1
    ),
    0
  ) AS consecutive_idle_days
),
today_subs AS (
  SELECT EXISTS (
    SELECT 1
    FROM public.dictation_submissions_view dsv
    WHERE dsv.user_id = p_uid
      AND dsv.date = (now() AT TIME ZONE 'Asia/Taipei'::text)::date
  ) AS has_submissions
)
SELECT
  l.assignment_id,
  l.title,
  l.due_at,
  l.published_at,
  COALESCE(v.done_count, 0) AS done_count,
  COALESCE(v.total_count, 0) AS total_count,
  n.article_id      AS next_article_id,
  n.sentence_id     AS next_sentence_id,
  n.full_title      AS next_full_title,
  n.sentence_seq    AS next_sentence_seq,
  t.a_ids           AS top_assignment_ids,
  mvj.id::text      AS mvj_id,
  mvj.image_url     AS mvj_image_url,
  mvj.reason        AS mvj_reason,
  mvj.title         AS mvj_title,
  mvj.due_at        AS mvj_due_at,
  pi.current_score  AS power_index,
  pi.power_index_state,
  latest_state.consecutive_idle_days,
  COALESCE(cs.current_streak_days, 0) AS current_streak_days,
  dictation_penalty(latest_state.consecutive_idle_days + 1) AS next_penalty,
  today_subs.has_submissions
FROM latest l
LEFT JOIN dictation_assignment_counts_view v ON v.id = l.assignment_id
LEFT JOIN nextq n ON n.assignment_id = l.assignment_id
CROSS JOIN tops t
LEFT JOIN mvj ON true
CROSS JOIN pi
CROSS JOIN latest_state
CROSS JOIN today_subs
LEFT JOIN public.dictation_current_streak_view cs
  ON cs.user_id = p_uid;
$function$


--- public.get_or_create_dictation_tag(p_label text)
CREATE OR REPLACE FUNCTION public.get_or_create_dictation_tag(p_label text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE v_id uuid;
BEGIN
  INSERT INTO public.dictation_tag_master(label)
  VALUES (p_label)
  ON CONFLICT (norm_label) DO UPDATE SET label = EXCLUDED.label
  RETURNING id INTO v_id;
  RETURN v_id;
END $function$


--- public.get_submission_by_id(p_submission_id uuid)
CREATE OR REPLACE FUNCTION public.get_submission_by_id(p_submission_id uuid)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
SELECT jsonb_build_object(
  'id', snt.id,
  'seq', snt.seq,
  'content', snt.content,
  'audio_path', snt.audio_path,
  'created_at', snt.created_at,
  'article', jsonb_build_object(
    'id', art.id,
    'assignment_id', art.assignment_id,
    'seq', art.seq,
    'created_at', art.created_at,
    'subtitle', art.subtitle,
    'audio_path_full', art.audio_path_full
  ),
  'submission', jsonb_build_object(
    'id', sub.id,
    'created_at', sub.created_at,
    'answer', sub.answer,
    'self_assessed_comprehension', sub.self_assessed_comprehension,
    'ai_feedback_md', sub.ai_feedback_md,
    'teacher_feedback_md', sub.teacher_feedback_md,
    'plays_count', sub.plays_count,
    'elapsed_ms_since_item_view', sub.elapsed_ms_since_item_view,
    'elapsed_ms_since_first_play', sub.elapsed_ms_since_first_play,
    'tags', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'created_at', t.created_at,
          'tag_master_id', t.tag_master_id,
          'label', tm.label
        )
        ORDER BY t.created_at ASC
      )
      FROM public.dictation_teacher_feedback_tags t
      LEFT JOIN public.dictation_tag_master tm ON tm.id = t.tag_master_id
      WHERE t.submission_id = sub.id
    ), '[]'::jsonb)
  )
)
FROM public.dictation_submissions sub
JOIN public.dictation_sentences snt ON snt.id = sub.sentence_id
JOIN public.dictation_articles  art ON art.id = snt.article_id
WHERE sub.id = p_submission_id;
$function$


--- public.get_submission_latest(p_limit integer, p_offset integer, p_user_id uuid, p_article_id uuid)
CREATE OR REPLACE FUNCTION public.get_submission_latest(p_limit integer DEFAULT 50, p_offset integer DEFAULT 0, p_user_id uuid DEFAULT NULL::uuid, p_article_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(id uuid, user_id uuid, sentence_id uuid, plays_count integer, elapsed_ms_since_item_view integer, elapsed_ms_since_first_play integer, answer text, self_assessed_comprehension integer, created_at timestamp with time zone, display text, content text, seq integer, article_id uuid, title text, subtitle text)
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT
    s.id,
    da.user_id,
    s.sentence_id,
    s.plays_count,
    s.elapsed_ms_since_item_view,
    s.elapsed_ms_since_first_play,
    s.answer,
    s.self_assessed_comprehension,
    s.created_at,
    u.display,
    ds.content,
    ds.seq,
    ds.article_id,
    da.title,
    a.subtitle
  FROM dictation_submissions s
  JOIN dictation_sentences ds ON ds.id = s.sentence_id
  JOIN dictation_articles  a ON a.id = ds.article_id
  JOIN dictation_assignments da ON da.id = a.assignment_id
  JOIN users u ON u.uid = da.user_id
  WHERE (p_user_id IS NULL OR da.user_id = p_user_id)
    AND (p_article_id IS NULL OR ds.article_id = p_article_id)
  ORDER BY s.created_at DESC
  LIMIT p_limit OFFSET p_offset;
$function$


--- public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal)
CREATE OR REPLACE FUNCTION public.gin_extract_query_trgm(text, internal, smallint, internal, internal, internal, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_extract_query_trgm$function$


--- public.gin_extract_value_trgm(text, internal)
CREATE OR REPLACE FUNCTION public.gin_extract_value_trgm(text, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_extract_value_trgm$function$


--- public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal)
CREATE OR REPLACE FUNCTION public.gin_trgm_consistent(internal, smallint, text, integer, internal, internal, internal, internal)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_trgm_consistent$function$


--- public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal)
CREATE OR REPLACE FUNCTION public.gin_trgm_triconsistent(internal, smallint, text, integer, internal, internal, internal)
 RETURNS "char"
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gin_trgm_triconsistent$function$


--- public.gtrgm_compress(internal)
CREATE OR REPLACE FUNCTION public.gtrgm_compress(internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_compress$function$


--- public.gtrgm_consistent(internal, text, smallint, oid, internal)
CREATE OR REPLACE FUNCTION public.gtrgm_consistent(internal, text, smallint, oid, internal)
 RETURNS boolean
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_consistent$function$


--- public.gtrgm_decompress(internal)
CREATE OR REPLACE FUNCTION public.gtrgm_decompress(internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_decompress$function$


--- public.gtrgm_distance(internal, text, smallint, oid, internal)
CREATE OR REPLACE FUNCTION public.gtrgm_distance(internal, text, smallint, oid, internal)
 RETURNS double precision
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_distance$function$


--- public.gtrgm_in(cstring)
CREATE OR REPLACE FUNCTION public.gtrgm_in(cstring)
 RETURNS gtrgm
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_in$function$


--- public.gtrgm_options(internal)
CREATE OR REPLACE FUNCTION public.gtrgm_options(internal)
 RETURNS void
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE
AS '$libdir/pg_trgm', $function$gtrgm_options$function$


--- public.gtrgm_out(gtrgm)
CREATE OR REPLACE FUNCTION public.gtrgm_out(gtrgm)
 RETURNS cstring
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_out$function$


--- public.gtrgm_penalty(internal, internal, internal)
CREATE OR REPLACE FUNCTION public.gtrgm_penalty(internal, internal, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_penalty$function$


--- public.gtrgm_picksplit(internal, internal)
CREATE OR REPLACE FUNCTION public.gtrgm_picksplit(internal, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_picksplit$function$


--- public.gtrgm_same(gtrgm, gtrgm, internal)
CREATE OR REPLACE FUNCTION public.gtrgm_same(gtrgm, gtrgm, internal)
 RETURNS internal
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_same$function$


--- public.gtrgm_union(internal, internal)
CREATE OR REPLACE FUNCTION public.gtrgm_union(internal, internal)
 RETURNS gtrgm
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$gtrgm_union$function$


--- public.immutable_unaccent(text)
CREATE OR REPLACE FUNCTION public.immutable_unaccent(text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  SELECT public.unaccent('public.unaccent'::regdictionary, $1);
$function$


--- public.insert_article_with_next_seq(p_assignment_id uuid, p_subtitle text)
CREATE OR REPLACE FUNCTION public.insert_article_with_next_seq(p_assignment_id uuid, p_subtitle text)
 RETURNS TABLE(id uuid, seq integer)
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$
WITH
  _lock AS (
    SELECT pg_advisory_xact_lock(
      hashtext('dictation_articles'),
      hashtext(p_assignment_id::text)
    )
  ),
  nxt AS (
    SELECT COALESCE(MAX(a.seq), 0) + 1 AS next_seq
    FROM public.dictation_articles a
    WHERE a.assignment_id = p_assignment_id
  ),
  ins AS (
    INSERT INTO public.dictation_articles (subtitle, audio_path_full, assignment_id, seq)
    SELECT p_subtitle, NULL, p_assignment_id, nxt.next_seq
    FROM nxt
    RETURNING id, seq
  )
SELECT id, seq FROM ins;
$function$


--- public.insert_thumbnail_with_image(p_user_id uuid, p_storage_path text, p_file_name text)
CREATE OR REPLACE FUNCTION public.insert_thumbnail_with_image(p_user_id uuid, p_storage_path text, p_file_name text)
 RETURNS TABLE(image_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_image_id uuid;
begin
  insert into pin_comment_images (user_id, storage_path, file_name)
    values (p_user_id, p_storage_path, p_file_name)
    returning id into v_image_id;

  insert into pin_comment_thumbnails (image_id, owner_id)
    values (v_image_id, p_user_id);

  return query select v_image_id;
end;
$function$


--- public.journal_vote(p_id uuid, p_delta integer)
CREATE OR REPLACE FUNCTION public.journal_vote(p_id uuid, p_delta integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
DECLARE
  v_created_at timestamptz;
BEGIN
  SELECT created_at
    INTO v_created_at
  FROM public.dictation_journals
  WHERE id = p_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'journal_not_found' USING ERRCODE='P0002';
  END IF;

  IF now() < v_created_at + interval '24 hours' THEN
    RAISE EXCEPTION 'vote_not_available' USING ERRCODE='P0001';
  END IF;

  UPDATE public.dictation_journals
  SET rating_score = COALESCE(rating_score, 0) + p_delta
  WHERE id = p_id;
END
$function$


--- public.pick_random_cloze_journal_fast(p_uid uuid)
CREATE OR REPLACE FUNCTION public.pick_random_cloze_journal_fast(p_uid uuid)
 RETURNS SETOF dictation_journals_view
 LANGUAGE sql
 SET search_path TO 'public'
AS $function$
with cand as (
  select j.*
  from public.dictation_journals_view j
  where j.user_id = p_uid
    and jsonb_typeof(j.cloze_spans) = 'array'
    and jsonb_array_length(j.cloze_spans) > 0
),
cnt as (select count(*) as c from cand),
off as (select (floor(random()*c))::bigint as k from cnt)
select *
from cand
order by cand.id
offset (select k from off)
limit 1;
$function$


--- public.save_dictation_journal(p_article_id uuid, p_body text)
CREATE OR REPLACE FUNCTION public.save_dictation_journal(p_article_id uuid, p_body text)
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth', 'pg_temp'
AS $function$
  INSERT INTO public.dictation_journals (article_id, body)
  VALUES (p_article_id, p_body)
  ON CONFLICT (article_id)
  DO UPDATE SET body = excluded.body;
$function$


--- public.set_limit(real)
CREATE OR REPLACE FUNCTION public.set_limit(real)
 RETURNS real
 LANGUAGE c
 STRICT
AS '$libdir/pg_trgm', $function$set_limit$function$


--- public.set_updated_at()
CREATE OR REPLACE FUNCTION public.set_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at = now();
  return new;
end; $function$


--- public.show_limit()
CREATE OR REPLACE FUNCTION public.show_limit()
 RETURNS real
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$show_limit$function$


--- public.show_trgm(text)
CREATE OR REPLACE FUNCTION public.show_trgm(text)
 RETURNS text[]
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$show_trgm$function$


--- public.similarity(text, text)
CREATE OR REPLACE FUNCTION public.similarity(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$similarity$function$


--- public.similarity_dist(text, text)
CREATE OR REPLACE FUNCTION public.similarity_dist(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$similarity_dist$function$


--- public.similarity_op(text, text)
CREATE OR REPLACE FUNCTION public.similarity_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$similarity_op$function$


--- public.strict_word_similarity(text, text)
CREATE OR REPLACE FUNCTION public.strict_word_similarity(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity$function$


--- public.strict_word_similarity_commutator_op(text, text)
CREATE OR REPLACE FUNCTION public.strict_word_similarity_commutator_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_commutator_op$function$


--- public.strict_word_similarity_dist_commutator_op(text, text)
CREATE OR REPLACE FUNCTION public.strict_word_similarity_dist_commutator_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_dist_commutator_op$function$


--- public.strict_word_similarity_dist_op(text, text)
CREATE OR REPLACE FUNCTION public.strict_word_similarity_dist_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_dist_op$function$


--- public.strict_word_similarity_op(text, text)
CREATE OR REPLACE FUNCTION public.strict_word_similarity_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$strict_word_similarity_op$function$


--- public.submit_mvj_and_awards(p_mvj_id uuid, p_reason text, p_image_url text, p_initial_ids uuid[], p_best_id uuid, p_hm_ids uuid[])
CREATE OR REPLACE FUNCTION public.submit_mvj_and_awards(p_mvj_id uuid, p_reason text, p_image_url text, p_initial_ids uuid[], p_best_id uuid, p_hm_ids uuid[])
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  -- MVJ の理由と画像URLを更新
  update public.dictation_mvjs
    set reason = p_reason,
        image_url = p_image_url
  where id = p_mvj_id;

  -- 対象 initialItems のみ self_award を一括更新
  update public.dictation_journals j
  set self_award = case
    when p_best_id is not null and j.id = p_best_id
      then 'mbest'::public.self_award_t
    when j.id = any(coalesce(p_hm_ids, '{}'::uuid[]))
      then 'mhm'::public.self_award_t
    else 'none'::public.self_award_t
  end
  where j.id = any(coalesce(p_initial_ids, '{}'::uuid[]));
end;
$function$


--- public.trg_dictation_journals_add_points()
CREATE OR REPLACE FUNCTION public.trg_dictation_journals_add_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
declare
  v_user  uuid;
  v_lines int;
  v_state public.dictation_power_index_state_t;
begin
  select user_id into v_user
  from public.dictation_journals_view
  where id = new.id;

  if v_user is null then
    return new;
  end if;

  select state into v_state
  from public.dictation_power_indices
  where user_id = v_user;

  if not found or v_state <> 'running' then
    return new;
  end if;

  v_lines := public.dictation_count_lines(new.body);

  update public.dictation_power_indices
    set current_score = current_score + v_lines
  where user_id = v_user;

  return new;
end;
$function$


--- public.trg_update_timestamp()
CREATE OR REPLACE FUNCTION public.trg_update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
begin
  new.updated_at := now();
  return new;
end;
$function$


--- public.unaccent(regdictionary, text)
CREATE OR REPLACE FUNCTION public.unaccent(regdictionary, text)
 RETURNS text
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/unaccent', $function$unaccent_dict$function$


--- public.unaccent(text)
CREATE OR REPLACE FUNCTION public.unaccent(text)
 RETURNS text
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/unaccent', $function$unaccent_dict$function$


--- public.unaccent_init(internal)
CREATE OR REPLACE FUNCTION public.unaccent_init(internal)
 RETURNS internal
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/unaccent', $function$unaccent_init$function$


--- public.unaccent_lexize(internal, internal, internal, internal)
CREATE OR REPLACE FUNCTION public.unaccent_lexize(internal, internal, internal, internal)
 RETURNS internal
 LANGUAGE c
 PARALLEL SAFE
AS '$libdir/unaccent', $function$unaccent_lexize$function$


--- public.word_similarity(text, text)
CREATE OR REPLACE FUNCTION public.word_similarity(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity$function$


--- public.word_similarity_commutator_op(text, text)
CREATE OR REPLACE FUNCTION public.word_similarity_commutator_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_commutator_op$function$


--- public.word_similarity_dist_commutator_op(text, text)
CREATE OR REPLACE FUNCTION public.word_similarity_dist_commutator_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_dist_commutator_op$function$


--- public.word_similarity_dist_op(text, text)
CREATE OR REPLACE FUNCTION public.word_similarity_dist_op(text, text)
 RETURNS real
 LANGUAGE c
 IMMUTABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_dist_op$function$


--- public.word_similarity_op(text, text)
CREATE OR REPLACE FUNCTION public.word_similarity_op(text, text)
 RETURNS boolean
 LANGUAGE c
 STABLE PARALLEL SAFE STRICT
AS '$libdir/pg_trgm', $function$word_similarity_op$function$


