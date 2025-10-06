// types/dictation.ts

export type Tag = {
  id: string;
  created_at: string;
  submission_id: string; // ← teacher_feedback_id は撤廃
  tag_master_id: string | null;
  label: string;
};

export type Submission = {
  id: string;
  answer: string | null; // RPC では null あり得る
  feedback_md: string | null;
  teacher_feedback: string | null; // ← 追加: 統合先
  self_assessed_comprehension: number | null; // RPC 整合
  created_at: string;
  tags: Tag[]; // ← 追加: submission 紐づけのタグ
};

export type Sentence = {
  id: string;
  seq: number;
  content: string;
  created_at: string;
  audio_path?: string | null;
  submission?: Submission | null;
  // teacher_feedback: FeedbackWithTags[] | null; // ← 削除
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

// 旧型は不要。互換が必要なら残す:
export type FeedbackWithTags = never; // or remove/export only for legacy

export type Metrics = {
  playsCount: number;
  listenedFullCount: number;
  elapsedMsSinceItemView: number;
  elapsedMsSinceFirstPlay: number;
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
    answer: string | null;
    self_assessed_comprehension: number | null;
    feedback_md: string | null;
    teacher_feedback: string | null; // ← 追加
    tags: Tag[]; // ← 追加
  };
  // teacher_feedback: FeedbackWithTags[]; // ← 削除
};
