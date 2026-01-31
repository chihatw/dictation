import Journal from '@/components/journal/Journal';
import { Tags } from '@/components/tag/Tags';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function AssignmentArticleRow({
  t,
}: {
  t: {
    id: string;
    subtitle: string;
    tags: string[];
    journal_body: string | null;
    journal_created_at: string | null;
  };
}) {
  const isEnabled = Boolean(t.journal_body);

  return (
    <li className='rounded border p-3'>
      <RowLinkWrapper enabled={isEnabled} href={`/articles/${t.id}`}>
        <RowContent enabled={isEnabled} subtitle={t.subtitle} />
      </RowLinkWrapper>

      {t.tags.length > 0 && (
        <div className='mt-1'>
          <Tags items={t.tags} />
        </div>
      )}

      {t.journal_body && t.journal_created_at && (
        <div className='mt-2'>
          <Journal body={t.journal_body} created_at={t.journal_created_at} />
        </div>
      )}
    </li>
  );
}

function RowLinkWrapper({
  enabled,
  href,
  children,
}: {
  enabled: boolean;
  href: string;
  children: React.ReactNode;
}) {
  if (!enabled) return <div className='block select-none'>{children}</div>;
  return (
    <Link href={href} className='block'>
      {children}
    </Link>
  );
}

function RowContent({
  enabled,
  subtitle,
}: {
  enabled: boolean;
  subtitle: string;
}) {
  let label = subtitle;

  if (!enabled) {
    label += '（尚未撰寫學習日誌）';
  }

  return (
    <div
      className={[
        'flex items-center',
        enabled
          ? 'hover:underline cursor-pointer'
          : 'opacity-50 cursor-not-allowed',
      ].join(' ')}
    >
      <div className='flex-1 truncate font-medium'>{label}</div>
      {enabled && <ChevronRight className='h-4 w-4 shrink-0' />}
    </div>
  );
}
