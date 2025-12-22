'use client';
import { useArticle } from '@/hooks/useArticle';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { toPublicUrl } from '@/lib/tts/publicUrl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SentenceAudioPanel } from './SentenceAudioPanel';

const AdminArticlePage = () => {
  const { id } = useParams<{ id: string }>();

  const { article } = useArticle(id);

  const player = useAudioPlayer();

  if (!article) return null;

  const audioFullUrl = article.audio_path_full
    ? toPublicUrl(article.audio_path_full)
    : undefined;

  return (
    <div>
      <h1 className='mb-6 text-2xl font-semibold'>課題文章</h1>
      <div className='space-y-6'>
        <Link
          href={`/admin/articles?assignment_id=${article.assignment_id}&user_id=${article.user_id}`}
          className='inline-flex items-center rounded-md border px-3 py-2 text-sm'
        >
          ユーザー別課題一覧に戻る
        </Link>
        <div>{`${article.title} ${article.subtitle}`}</div>
        <SentenceAudioPanel
          audioFullUrl={audioFullUrl}
          sentences={article.sentences}
          player={player}
        />
      </div>
    </div>
  );
};

export default AdminArticlePage;
