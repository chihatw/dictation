// app/actions/createLogAction.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  sentenceId: z.string().uuid(),
  answer: z.string().optional(),
  playsCount: z.number().int().nonnegative(),
  listenedFullCount: z.number().int().nonnegative(),
  usedPlayAll: z.boolean(),
  elapsedMsSinceItemView: z.number().int().nonnegative(),
  elapsedMsSinceFirstPlay: z.number().int().nonnegative(),
});

export async function createLogAction(input: unknown) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: '入力不正' };
  const {
    sentenceId,
    answer,
    playsCount,
    listenedFullCount,
    usedPlayAll,
    elapsedMsSinceItemView,
    elapsedMsSinceFirstPlay,
  } = parsed.data;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return { ok: false, error: '未認証' };

  const { error } = await supabase.from('dictation_submission_logs').insert({
    user_id: userId,
    sentence_id: sentenceId,
    answer,
    plays_count: playsCount,
    listened_full_count: listenedFullCount,
    used_play_all: usedPlayAll,
    elapsed_ms_since_item_view: elapsedMsSinceItemView,
    elapsed_ms_since_first_play: elapsedMsSinceFirstPlay,
  });

  if (error) return { ok: false, error: '保存失敗' };
  return { ok: true };
}
