'use client';
import { ClozeLine, ClozeSpan, Journal } from '@/types/dictation';
import { parseCloze, parseSpansFromCloze } from '@/utils/cloze/converter';
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import ClozeRow from '../ClozeRow';

type Props = { journal: Journal };

const ClozeMaker = ({ journal }: Props) => {
  const journalBody = useMemo(() => journal.body, [journal]);
  const [clozeText, setClozeText] = useState(journalBody.trim());
  const [clozeSpans, setClozeSpans] = useState<ClozeSpan[]>([]);

  const [parseError, setParseError] = useState('');
  const [clozeLines, setClozeLines] = useState<ClozeLine[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // clozeParts の初期化
  useEffect(() => {
    const lines = journalBody.trim().split('\n').map(parseCloze);
    setClozeLines(lines);
  }, [journalBody]);

  // テキストエリアの高さ調節
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = '0px';
    ta.style.height = ta.scrollHeight + 'px';
  }, [clozeText]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setParseError('');
    setClozeText(next);
    try {
      const spans = parseSpansFromCloze(journalBody, next);
      setClozeSpans(spans);

      const lines = next.trim().split('\n').map(parseCloze);
      setClozeLines(lines);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <h2 className='font-bold mb-2'>學習日誌</h2>
        <div className='p-4 rounded-lg border'>
          {journalBody.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>
      <div className='flex flex-col'>
        <h2 className='font-bold mb-2'>穴埋め問題作成</h2>
        <div className='mb-2 font-light text-sm text-slate-700 leading-tight'>
          <div>空欄にしたいところを[[...]]で囲んでください。</div>
          <div>それ以外の文字の変更はできません。</div>
        </div>
        <textarea
          ref={textareaRef}
          className='border rounded p-4 h-auto resize-none overflow-hidden bg-white focus:outline-0'
          value={clozeText}
          onChange={handleChange}
        />
      </div>
      <div>
        <h2 className='font-bold mb-2'>Cloze Spans</h2>
        {!!parseError && (
          <div className='text-red-500 text-sm mb-2'>
            {JSON.stringify(parseError)}
          </div>
        )}
        <div className='p-4 rounded-lg border'>
          <pre>{JSON.stringify(clozeSpans)}</pre>
        </div>
      </div>
      <div>
        <h2 className='font-bold mb-2'>結果</h2>

        <div className='p-4 rounded-lg border'>
          {!parseError && (
            <div className='flex flex-col gap-2'>
              {clozeLines.map((line, index) => (
                <div key={index}>
                  <ClozeRow line={line} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className='h-24' />
    </div>
  );
};

export default ClozeMaker;
