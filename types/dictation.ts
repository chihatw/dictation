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
  submission?: Submission[] | null;
};

export type Article = {
  id: string;
  title: string;
  created_at: string;
  tts_voice_name: string;
  speaking_rate: number;
  sentences: Sentence[];
};
