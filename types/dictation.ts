// types/dictation.ts

type Tag = {
  id: string;
  created_at: string;
  submission_id: string;
  tag_master_id: string | null;
  label: string;
};

type Submission = {
  id: string;
  answer: string | null;
  feedback_md: string | null;
  teacher_feedback: string | null;
  self_assessed_comprehension: number | null;
  created_at: string;
  tags: Tag[];
  plays_count: number;
  elapsed_ms_since_item_view: number;
  elapsed_ms_since_first_play: number;
};

type Sentence = {
  id: string;
  seq: number;
  content: string;
  created_at: string;
  audio_path?: string | null;
  submission?: Submission | null;
};

export type Article = {
  id: string;
  uid: string;
  title: string; // todo title -> subtitle
  created_at: string;
  journal: { body: string; created_at: string } | null;
  sentences: Sentence[];
  audio_path_full?: string | null;
  collection_id: string;
};

export type SubmissionAdminData = {
  id: string;
  seq: number;
  content: string;
  audio_path: string | null;
  article: {
    id: string;
    subtitle: string;
    audio_path_full: string | null;
  };
  submission: {
    id: string;
    created_at: string;
    answer: string | null;
    self_assessed_comprehension: number | null;
    feedback_md: string | null;
    teacher_feedback: string | null;
    plays_count: number;
    elapsed_ms_since_item_view: number;
    elapsed_ms_since_first_play: number;
    tags: Tag[];
  };
};
