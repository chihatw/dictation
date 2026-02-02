CREATE VIEW public.dictation_journals_view WITH (security_invoker='true') AS
 SELECT ass.user_id,
    j.id,
    j.article_id,
    ar.assignment_id,
    ar.seq AS article_seq,
    j.created_at,
    j.body,
    cardinality(regexp_split_to_array(COALESCE(j.body, ''::text), '?
'::text)) AS lines_count,
    j.rating_score,
    j.cloze_spans,
    j.locked,
    j.self_award,
    ass.due_at
   FROM ((public.dictation_journals j
     JOIN public.dictation_articles ar ON ((ar.id = j.article_id)))
     JOIN public.dictation_assignments ass ON ((ass.id = ar.assignment_id)));
CREATE VIEW public.dictation_article_journal_status_view WITH (security_invoker='true') AS
 SELECT (max((art.assignment_id)::text))::uuid AS assignment_id,
    s.article_id,
    max(ass.title) AS title,
    max(art.subtitle) AS subtitle,
    concat_ws(' '::text, max(ass.title), max(art.subtitle)) AS full_title,
    max(art.seq) AS seq,
    count(*) AS total_count,
    count(sub.id) AS done_count,
    (count(*) = count(sub.id)) AS all_done,
    bool_or((j.id IS NOT NULL)) AS has_journal,
    max((j.id)::text) AS journal_id,
    bool_or((jsonb_array_length(COALESCE(j.cloze_spans, '[]'::jsonb)) > 0)) AS has_cloze_spans,
    bool_and(COALESCE(j.locked, false)) AS journal_locked
   FROM ((((public.dictation_sentences s
     JOIN public.dictation_articles art ON ((art.id = s.article_id)))
     JOIN public.dictation_assignments ass ON ((ass.id = art.assignment_id)))
     LEFT JOIN public.dictation_submissions sub ON ((sub.sentence_id = s.id)))
     LEFT JOIN public.dictation_journals j ON ((j.article_id = s.article_id)))
  GROUP BY s.article_id;
CREATE VIEW public.dictation_assignment_counts_view WITH (security_invoker='true') AS
 SELECT art.assignment_id AS id,
    max(ass.created_at) AS created_at,
    (max((ass.user_id)::text))::uuid AS user_id,
    max(ass.title) AS title,
    max(ass.due_at) AS due_at,
    max(ass.published_at) AS published_at,
    count(s.id) AS total_count,
    count(sub.id) AS done_count
   FROM (((public.dictation_articles art
     LEFT JOIN public.dictation_sentences s ON ((s.article_id = art.id)))
     LEFT JOIN public.dictation_submissions sub ON ((sub.sentence_id = s.id)))
     JOIN public.dictation_assignments ass ON ((art.assignment_id = ass.id)))
  GROUP BY art.assignment_id;
CREATE VIEW public.dictation_assignments_view WITH (security_invoker='true') AS
 SELECT a.id,
    a.user_id,
    a.title,
    a.due_at,
    a.published_at,
    (a.due_at AT TIME ZONE 'Asia/Taipei'::text) AS due_at_tpe,
    (EXTRACT(year FROM (a.due_at AT TIME ZONE 'Asia/Taipei'::text)))::integer AS due_year_tpe,
    (EXTRACT(month FROM (a.due_at AT TIME ZONE 'Asia/Taipei'::text)))::integer AS due_month_tpe,
    to_char((a.due_at AT TIME ZONE 'Asia/Taipei'::text), 'YYYY-MM'::text) AS due_ym_key,
    (a.published_at IS NOT NULL) AS is_published
   FROM public.dictation_assignments a;
CREATE VIEW public.dictation_current_streak_view WITH (security_invoker='true') AS
 WITH base AS (
         SELECT dictation_power_index_daily.user_id,
            dictation_power_index_daily.day,
            dictation_power_index_daily.state,
            dictation_power_index_daily.score,
            lag(dictation_power_index_daily.score) OVER (PARTITION BY dictation_power_index_daily.user_id ORDER BY dictation_power_index_daily.day) AS prev_score
           FROM public.dictation_power_index_daily
        ), marks AS (
         SELECT base.user_id,
            base.day,
            base.state,
            base.score,
            base.prev_score,
                CASE
                    WHEN ((base.state = 'running'::public.dictation_power_index_state_t) AND (base.prev_score IS NOT NULL) AND (base.score < base.prev_score)) THEN 1
                    ELSE 0
                END AS is_decrease
           FROM base
        ), segments AS (
         SELECT marks.user_id,
            marks.day,
            marks.state,
            marks.score,
            marks.prev_score,
            marks.is_decrease,
            sum(marks.is_decrease) OVER (PARTITION BY marks.user_id ORDER BY marks.day ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS segment_id
           FROM marks
        ), last_segment AS (
         SELECT segments.user_id,
            max(segments.segment_id) AS segment_id
           FROM segments
          GROUP BY segments.user_id
        )
 SELECT s.user_id,
    count(*) FILTER (WHERE ((s.state = 'running'::public.dictation_power_index_state_t) AND ((s.prev_score IS NULL) OR (s.score >= s.prev_score)) AND (s.is_decrease = 0))) AS current_streak_days,
    min(s.day) FILTER (WHERE ((s.state = 'running'::public.dictation_power_index_state_t) AND ((s.prev_score IS NULL) OR (s.score >= s.prev_score)) AND (s.is_decrease = 0))) AS streak_start_day,
    max(s.day) AS latest_logged_day
   FROM (segments s
     JOIN last_segment ls ON (((s.user_id = ls.user_id) AND (s.segment_id = ls.segment_id))))
  GROUP BY s.user_id;
CREATE VIEW public.dictation_journals_daily_users_view WITH (security_invoker='true') AS
 SELECT ass.user_id,
    j.created_at
   FROM ((public.dictation_journals j
     JOIN public.dictation_articles art ON ((art.id = j.article_id)))
     JOIN public.dictation_assignments ass ON ((ass.id = art.assignment_id)));
CREATE VIEW public.dictation_sentences_view WITH (security_invoker='true') AS
 SELECT ass.user_id,
    art.assignment_id,
    ass.title,
    s.article_id,
    art.seq AS article_seq,
    art.subtitle,
    s.seq AS sentence_seq,
    s.id AS sentence_id,
    sub.id AS submission_id,
    s.created_at,
    s.content,
    s.audio_path,
    concat_ws(' '::text, ass.title, art.subtitle) AS full_title
   FROM (((public.dictation_sentences s
     JOIN public.dictation_articles art ON ((art.id = s.article_id)))
     JOIN public.dictation_assignments ass ON ((ass.id = art.assignment_id)))
     LEFT JOIN public.dictation_submissions sub ON ((sub.sentence_id = s.id)));
CREATE VIEW public.dictation_submissions_daily_users_view WITH (security_invoker='true') AS
 SELECT ass.user_id,
    sub.created_at
   FROM (((public.dictation_submissions sub
     JOIN public.dictation_sentences s ON ((s.id = sub.sentence_id)))
     JOIN public.dictation_articles art ON ((art.id = s.article_id)))
     JOIN public.dictation_assignments ass ON ((ass.id = art.assignment_id)));
CREATE VIEW public.dictation_submissions_view WITH (security_invoker='true') AS
 SELECT ass.user_id,
    art.assignment_id,
    s.article_id,
    s.id AS sentence_id,
    sub.id AS submission_id,
    sub.created_at,
    ((sub.created_at AT TIME ZONE 'Asia/Taipei'::text))::date AS date,
    sub.answer,
    sub.ai_feedback_md,
    sub.plays_count,
    sub.elapsed_ms_since_item_view,
    sub.elapsed_ms_since_first_play,
    sub.self_assessed_comprehension,
    sub.teacher_feedback_md
   FROM (((public.dictation_submissions sub
     JOIN public.dictation_sentences s ON ((s.id = sub.sentence_id)))
     JOIN public.dictation_articles art ON ((art.id = s.article_id)))
     JOIN public.dictation_assignments ass ON ((ass.id = art.assignment_id)));
