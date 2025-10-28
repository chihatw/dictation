import { MVJ } from '@/types/dictation';

export const MVJ_DUMMY: MVJ = {
  id: '0558d7fd-2cd1-4c14-9bf8-d1cf3bf99c35',
  created_at: '2025-10-28T01:39:01.808532+00:00',
  user_id: 'c049d5c9-66ba-4986-94f3-48c99d893457',
  scope: 'monthly',
  title: '2025年9-10月最有價值日誌',
  window_start: '2025-08-31T15:00:00+00:00',
  window_end: '2025-10-31T15:00:00+00:00',
  published_at: '2025-10-28T01:39:37+00:00',
  due_at: '2025-11-11T16:00:00+00:00',
  reason: null,
};

export const JOURNALS_DUMMY = [
  {
    id: '5c6a9441-f75d-4473-9975-9b8d0a108925',
    created_at: '2025-10-07T06:10:38.617066+00:00',
    article_id: '5c0cbee9-b1b6-4d39-a2a2-ce018d43c749',
    body: 'これ保存できない？',
    rating_score: 0,
    self_award: 'none',
    cloze_spans: [],
    locked: true,
  },
  {
    id: '0851dbb3-4cb2-418f-b9fd-07f2a64b69b4',
    created_at: '2025-10-20T04:35:29.171544+00:00',
    article_id: 'ba6a7f9e-4d0c-4b01-9208-beff5df69d3d',
    body: '後追いで学習日誌が書けるかな？',
    rating_score: -1,
    self_award: 'none',
    cloze_spans: [],
    locked: true,
  },
  {
    id: '469df88d-b058-466c-9565-d499b7204722',
    created_at: '2025-10-21T04:25:34.88536+00:00',
    article_id: 'cbe4b7a3-e11b-4511-b82a-085b112e0e0a',
    body: 'realtime subscript で監視中。',
    rating_score: 1,
    self_award: 'none',
    cloze_spans: [],
    locked: false,
  },
  {
    id: 'af92d3a4-eb79-466e-a8de-6e25695ffcb9',
    created_at: '2025-10-04T15:42:39.882451+00:00',
    article_id: '87080262-1be1-4b4d-8561-ca308306a175',
    body: '学習日誌の壊れも直ったよ〜\n二行目',
    rating_score: 2,
    self_award: 'none',
    cloze_spans: [
      [5, 2],
      [14, 1],
    ],
    locked: true,
  },
];
