import type { FeedbackWithTags } from '@/types/dictation';

export type SentenceAdminData = {
  id: string;
  seq: number;
  content: string;
  audio_path: string | null;
  article: {
    id: string;
    subtitle: string;
    audio_path_full: string | null;
  };
  teacher_feedback: FeedbackWithTags[];
};
