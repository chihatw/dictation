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
};

export type Article = {
  id: string;
  uid: string;
  title: string;
  created_at: string;
  journal: { body: string; created_at: string } | null;
  sentences: Sentence[];
  audio_path_full?: string | null;
};
