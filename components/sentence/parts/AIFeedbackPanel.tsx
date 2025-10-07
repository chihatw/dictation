'use client';

import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { Article } from '@/types/dictation';
import { memo } from 'react';

type AIFeedbackPanelProps = {
  show: boolean;
  sentence: Article['sentences'][number];
  selfAssessedComprehension: number;
};

function AIFeedbackPanelBase({
  show,
  sentence,
  selfAssessedComprehension,
}: AIFeedbackPanelProps) {
  if (!show) return null;

  const aiFeedback = sentence.submission?.feedback_md ?? '';

  // 表示用マップ
  const compMap: Record<number, string> = {
    1: '😕 聽不懂',
    2: '🙂 大致懂',
    3: '😀 幾乎全懂',
    4: '🗣️✍️ 可運用',
  };

  return (
    <div
      className='mt-4 rounded-md border p-3'
      aria-live='polite'
      id={`sentence-${sentence.id}-feedback`}
    >
      <div className='mb-2 text-sm font-semibold text-gray-700'>AI回饋</div>
      <div className='prose prose-sm max-w-none'>
        <MarkdownRenderer markdown={aiFeedback} />
      </div>

      <div className='mt-4 rounded-md bg-gray-50 p-3'>
        <div className='mb-1 text-xs font-semibold text-gray-500'>音聲原文</div>
        <p className='whitespace-pre-wrap text-gray-800'>{sentence.content}</p>
      </div>

      <div className='mt-2 flex gap-4 justify-end px-2'>
        <p className='text-sm text-gray-800'>
          {compMap[selfAssessedComprehension] ??
            `等級 ${selfAssessedComprehension}`}
        </p>
      </div>
    </div>
  );
}

export const AIFeedbackPanel = memo(AIFeedbackPanelBase);
