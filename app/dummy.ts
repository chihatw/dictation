type Rpc<T> = { data: T; error: unknown | null | undefined };
type Weather = {
  yunlin: Record<string, unknown>;
  hyogo: Record<string, unknown>;
};

export const nextTask: Rpc<{
  mvj_id: string;
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
export const journals: Rpc<any[]> = { data: [], error: undefined };
export const weather: Weather = { yunlin: {}, hyogo: {} };
