import { VOICES } from '@/lib/tts/constants';
import { z } from 'zod';

export const articleInputSchema = z.object({
  uid: z.string().min(1, 'uid が未選択です'),
  title: z.string().trim().min(1, 'タイトルは必須です'),
  body: z.string().trim().min(1, '本文は必須です'),
  ttsVoiceName: z.enum(VOICES),
  speakingRate: z.number().gt(0).lte(4.0),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;
