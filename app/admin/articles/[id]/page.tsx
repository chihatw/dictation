import { createClient } from '@/lib/supabase/server';
import { toPublicUrl } from '@/lib/tts/publicUrl';
import { ChevronLeft, FileMusic, Folder } from 'lucide-react';
import Link from 'next/link';
import { SentenceAudioPanel } from './SentenceAudioPanel';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) throw new Error('id is required');

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('dictation_sentences')
    .select(
      `
      id,
      seq,
      audio_path,
      dictation_articles(
        subtitle,
        audio_path_full,
        assignment_id,
        dictation_assignments(
          title,
          dictation_lessons(
            due_at
          ),
          profiles(
            display
          )
        )
      )  
    `,
    )
    .eq('article_id', id)
    .order('seq');
  if (error) throw new Error(error.message);
  if (!data || !data[0]) throw new Error('Sentences not found');

  const article = data[0].dictation_articles;

  const {
    subtitle,
    audio_path_full,
    assignment_id,
    dictation_assignments: {
      title,
      dictation_lessons: { due_at },
      profiles: { display },
    },
  } = article;

  const dueAt = new Date(due_at);

  const sentences = data.map((s) => ({
    id: s.id,
    seq: s.seq,
    audio_path: s.audio_path,
  }));

  const audioFullUrl = audio_path_full ? toPublicUrl(audio_path_full) : null;

  return (
    <div className='mx-auto max-w-xl px-4 py-6'>
      <Link
        href={`/admin/assignments/${assignment_id}`}
        className='inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm text-gray-800 hover:bg-gray-50 mb-2'
      >
        <ChevronLeft className='h-4 w-4' />
        <Folder className='h-4 w-4' />
        <span>{display}</span>
        <span>{title}</span>
      </Link>
      <h1 className='mb-6 text-2xl font-semibold flex items-center gap-2'>
        <FileMusic />
        {subtitle}
      </h1>
      <div className='space-y-6'>
        <SentenceAudioPanel audioFullUrl={audioFullUrl} sentences={sentences} />
      </div>
    </div>
  );
}
