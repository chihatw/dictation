type Rpc<T> = { data: T; error: unknown | null | undefined };
type Weather = {
  yunlin: Record<string, unknown>;
  hyogo: Record<string, unknown>;
};

export const nextTask: Rpc<{
  mvj_id: string;
  mvj_image_url: string;
  mvj_reason: string;
  published_at: null;
  due_at: null;
  next_article_id: null;
  total_count: null;
  top_assignment_ids: string[];
  assignment_id: string;
  next_full_title: null;
  next_sentence_seq: null;
  title: null;
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
    top_assignment_ids: [],
    assignment_id: '',
    next_full_title: null,
    next_sentence_seq: null,
    title: null,
  },
  error: undefined,
};
export const journals: Rpc<any[]> = {
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
export const weather: Weather = { yunlin: {}, hyogo: {} };
