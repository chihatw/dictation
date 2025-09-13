export type Submission = {
  id: string;
  answer: string | null;
  feedback_md: string | null;
  created_at: string;
};

export type Sentence = {
  id: string;
  seq: number;
  content: string;
  created_at: string;
  audio_path?: string | null;
  submission?: Submission[] | null;
  self_assessed_comprehension: number;
};

export type Article = {
  id: string;
  uid: string;
  title: string;
  created_at: string;
  tts_voice_name: string;
  speaking_rate: number;
  sentences: Sentence[];
  audio_path_full?: string | null;
};
