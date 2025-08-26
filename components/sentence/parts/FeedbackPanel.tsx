'use client';

import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { memo } from 'react';

export type FeedbackPanelProps = {
  show: boolean;
  feedback: string;
  transcript: string;
  ariaLiveId?: string;
};

function FeedbackPanelBase({
  show,
  feedback,
  transcript,
  ariaLiveId,
}: FeedbackPanelProps) {
  if (!show) return null;
  return (
    <div
      className='mt-4 rounded-md border p-3'
      aria-live='polite'
      id={ariaLiveId}
    >
      <div className='mb-2 text-sm font-semibold text-gray-700'>AI回饋</div>
      <div className='prose prose-sm max-w-none'>
        <MarkdownRenderer markdown={feedback} />
      </div>

      <div className='mt-4 rounded-md bg-gray-50 p-3'>
        <div className='mb-1 text-xs font-semibold text-gray-500'>音聲原文</div>
        <p className='whitespace-pre-wrap text-gray-800'>{transcript}</p>
      </div>
    </div>
  );
}

export const FeedbackPanel = memo(FeedbackPanelBase);
