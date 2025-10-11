// app/admin/submissions/[id]/teacher_feedback/page.tsx
import { AdminTeacherFeedbackClient } from '@/components/articles/AdminTeacherFeedbackClient';
import { HeaderRow } from '@/components/sentence/parts/HeaderRow';
import { createClient } from '@/lib/supabase/server';
import { toPublicUrl } from '@/lib/tts/publicUrl';
import { SubmissionWithSubmissionAndArticle } from '@/types/dictation';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { id } = await props.params; // submission id
  const supabase = await createClient();

  const { data, error } = await supabase
    .rpc('get_submission_by_id', { p_submission_id: id })
    .single<SubmissionWithSubmissionAndArticle>();
  if (error) throw new Error(error.message);
  if (!data) return notFound();

  const s = data;

  return (
    <div className='mx-auto max-w-3xl p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-lg font-semibold'>
          短評編集 / {s.article.subtitle} / #{s.seq}
        </h1>
        <Link href={`/articles/${s.article.id}`} className='text-sm underline'>
          ← 記事に戻る
        </Link>
      </div>

      <section className='rounded-xl border bg-white p-4 shadow-sm'>
        <HeaderRow
          id={`sentence-${s.id}`}
          seq={s.seq}
          audioUrl={s.audio_path ? toPublicUrl(s.audio_path) : undefined}
        />

        <div className='mt-3 text-sm text-slate-600'>
          <span className='font-medium'>原文：</span>
          {s.content}
        </div>

        <div className='mt-3 text-sm text-slate-600'>
          <span className='font-medium'>回答：</span>
          {s.submission!.answer}
        </div>

        <AdminTeacherFeedbackClient submission={s.submission!} />
      </section>
    </div>
  );
}
