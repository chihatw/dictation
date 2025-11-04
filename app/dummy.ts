import { PIState } from '@/types/dictation';

type Rpc<T> = { data: T; error: unknown | null | undefined };
type Weather = {
  yunlin: Record<string, unknown>;
  hyogo: Record<string, unknown>;
};

export const NEXT_TASK: Rpc<{
  mvj_id: string;
  mvj_image_url: string;
  mvj_reason: string;
  published_at: null;
  due_at: null;
  next_article_id: null;
  total_count: null;
  done_count: null;
  top_assignment_ids: string[];
  assignment_id: string;
  next_full_title: null;
  next_sentence_seq: null;
  title: null;
  power_index: number;
  consecutive_idle_days: number;
  next_penalty: number;
  has_submissions: boolean;
  power_index_state: PIState;
}> = {
  data: {
    mvj_id: 'dummy',
    mvj_image_url:
      'https://ifhrlwhlgpgzpmwdonjo.supabase.co/storage/v1/object/public/dictation-mvj/c049d5c9-66ba-4986-94f3-48c99d893457/0558d7fd-2cd1-4c14-9bf8-d1cf3bf99c35_1761835072763.png',
    mvj_reason: 'これはダミーの mvj reason です。',
    published_at: null,
    due_at: null,
    next_article_id: null,
    total_count: null,
    done_count: null,
    top_assignment_ids: [],
    assignment_id: '',
    next_full_title: null,
    next_sentence_seq: null,
    title: null,
    power_index: 112,
    consecutive_idle_days: 0,
    next_penalty: 1,
    has_submissions: false,
    power_index_state: 'running',
  },
  error: undefined,
};
export const JOURNALS: Rpc<any[]> = {
  data: [
    {
      id: 'af92d3a4-eb79-466e-a8de-6e25695ffcb9',
      created_at: '2025-10-04T15:42:39.882451+00:00',
      article_id: '87080262-1be1-4b4d-8561-ca308306a175',
      body: '学習日誌の壊れも直ったよ〜\n二行目',
      rating_score: 2,
      cloze_spans: [
        [5, 2],
        [14, 1],
      ],
      assignment_id: '85ba64c2-e153-429c-b54c-864722285939',
      user_id: 'c049d5c9-66ba-4986-94f3-48c99d893457',
      article_seq: 1,
      locked: true,
      self_award: 'none',
      due_at: '2025-10-15T10:00:00+00:00',
    },
  ],
  error: undefined,
};
export const WEATHER: Weather = { yunlin: {}, hyogo: {} };

export const DAILY_POWER_INDEX: Rpc<{ day: string; score: number }[]> = {
  data: [
    {
      day: '2025-10-28',
      score: 120,
    },
    {
      day: '2025-10-29',
      score: 124,
    },
    {
      day: '2025-10-30',
      score: 127,
    },
    {
      day: '2025-10-31',
      score: 131,
    },
    {
      day: '2025-11-01',
      score: 133,
    },
    {
      day: '2025-11-02',
      score: 100,
    },
    {
      day: '2025-11-03',
      score: 100,
    },
  ],
  error: undefined,
};
