CREATE TABLE public.dictation_articles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    subtitle text DEFAULT 'Untitled'::text NOT NULL,
    audio_path_full text,
    assignment_id uuid NOT NULL,
    seq integer NOT NULL,
    CONSTRAINT dictation_articles_seq_chk CHECK (((seq IS NULL) OR (seq >= 1)))
);
CREATE TABLE public.dictation_assignments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    due_at timestamp with time zone,
    published_at timestamp with time zone
);
CREATE TABLE public.dictation_journals (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    article_id uuid NOT NULL,
    body text NOT NULL,
    rating_score integer DEFAULT 0 NOT NULL,
    cloze_spans jsonb DEFAULT '[]'::jsonb NOT NULL,
    locked boolean DEFAULT false NOT NULL,
    self_award public.self_award_t DEFAULT 'none'::public.self_award_t NOT NULL
);
CREATE TABLE public.dictation_sentences (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    article_id uuid NOT NULL,
    seq integer NOT NULL,
    content text NOT NULL,
    audio_path text
);
CREATE TABLE public.dictation_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    sentence_id uuid NOT NULL,
    answer text NOT NULL,
    ai_feedback_md text,
    plays_count integer DEFAULT 0 NOT NULL,
    elapsed_ms_since_item_view integer DEFAULT 0 NOT NULL,
    elapsed_ms_since_first_play integer DEFAULT 0 NOT NULL,
    self_assessed_comprehension smallint DEFAULT 4 NOT NULL,
    teacher_feedback_md text,
    CONSTRAINT ds_comp_chk CHECK (((self_assessed_comprehension >= 1) AND (self_assessed_comprehension <= 4)))
);
CREATE TABLE public.dictation_power_index_daily (
    user_id uuid NOT NULL,
    day date NOT NULL,
    state public.dictation_power_index_state_t NOT NULL,
    score integer NOT NULL,
    consecutive_idle_days integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.dictation_mvjs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_id uuid NOT NULL,
    scope public.mvj_scope_t DEFAULT 'monthly'::public.mvj_scope_t NOT NULL,
    title text NOT NULL,
    window_start timestamp with time zone NOT NULL,
    window_end timestamp with time zone NOT NULL,
    published_at timestamp with time zone,
    due_at timestamp with time zone NOT NULL,
    reason text,
    image_url text
);
CREATE TABLE public.dictation_power_indices (
    user_id uuid NOT NULL,
    current_score integer DEFAULT 0 NOT NULL,
    state public.dictation_power_index_state_t DEFAULT 'stopped'::public.dictation_power_index_state_t NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);
CREATE TABLE public.dictation_tag_master (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    label text NOT NULL,
    norm_label text GENERATED ALWAYS AS (lower(TRIM(BOTH FROM public.immutable_unaccent(label)))) STORED,
    CONSTRAINT dictation_tag_master_label_not_blank CHECK ((length(TRIM(BOTH FROM label)) > 0))
);
CREATE TABLE public.dictation_teacher_feedback_tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    tag_master_id uuid,
    submission_id uuid NOT NULL
);
