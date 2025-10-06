// types/dictation.ts

export type Submission = {
  id: string;
  answer: string;
  feedback_md: string | null;
  self_assessed_comprehension: number;
  created_at: string;
};

export type Metrics = {
  playsCount: number;
  listenedFullCount: number;
  elapsedMsSinceItemView: number;
  elapsedMsSinceFirstPlay: number;
};

export type Sentence = {
  id: string;
  seq: number;
  content: string;
  created_at: string;
  audio_path?: string | null;
  submission?: Submission | null;
  teacher_feedback: FeedbackWithTags[] | null;
};

export type Article = {
  id: string;
  uid: string;
  title: string;
  created_at: string;
  journal: { body: string; created_at: string } | null;
  sentences: Sentence[];
  audio_path_full?: string | null;
  collection_id: string;
};

export type Tag = {
  id: string;
  created_at: string;
  teacher_feedback_id: string;
  tag_master_id: string | null;
  label: string;
};

export type FeedbackWithTags = {
  id: string;
  created_at: string;
  submission_id: string;
  note_md: string;
  tags: Tag[];
};

export type SubmissionAdminData = {
  id: string;
  seq: number;
  content: string;
  audio_path: string | null;
  article: { id: string; subtitle: string; audio_path_full: string | null };
  submission: {
    id: string;
    created_at: string;
    answer: string;
    self_assessed_comprehension: number;
  };
  teacher_feedback: FeedbackWithTags[];
};
