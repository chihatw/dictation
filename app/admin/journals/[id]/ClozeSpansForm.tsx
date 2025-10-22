'use client';
import { ClozeObjLine, ClozeSpan, Journal } from '@/types/dictation';
import {
  makeClozeText,
  parseCloze,
  parseSpansFromCloze,
} from '@/utils/cloze/converter';
import { LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import ClozeRow from '@/components/cloze/ClozeRow';
import { updateJournalClozeSpans } from './actions';

type Props = { journal: Journal; assignmentId?: string; userId?: string };

const ClozeSpansForm = ({ journal, assignmentId, userId }: Props) => {
  const router = useRouter();
  const JOURNAL_BODY = useMemo(() => journal.body, [journal]);
  const CLOZE_OBJ_LINES = useMemo(() => {
    const _clozeText = makeClozeText(journal.body, journal.cloze_spans);
    return _clozeText
      .split('\n')
      .filter(Boolean)
      .map((clozeText) => parseCloze(clozeText));
  }, [journal]);

  const [clozeText, setClozeText] = useState('');
  const [clozeSpans, setClozeSpans] = useState<ClozeSpan[]>([]);
  const [clozeObjLines, setClozeObjLines] = useState<ClozeObjLine[]>([]);

  const [parseError, setParseError] = useState('');

  const [isPending, startTransition] = useTransition();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // clozeText, clozeSpans, clozeParts の初期化
  useEffect(() => {
    const _clozeText = makeClozeText(journal.body, journal.cloze_spans);

    const _clozeObjLines = _clozeText
      .split('\n')
      .filter(Boolean)
      .map((clozeText) => parseCloze(clozeText));

    setClozeText(_clozeText);
    setClozeSpans(journal.cloze_spans);
    setClozeObjLines(_clozeObjLines);
  }, [journal]);

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
    setClozeSpans([]);
    setClozeText(next);
    try {
      const spans = parseSpansFromCloze(JOURNAL_BODY, next);
      setClozeSpans(spans);

      const lines = next.trim().split('\n').map(parseCloze);
      setClozeObjLines(lines);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : String(err));
    }
  };

  async function action(formData: FormData) {
    const raw = formData.get('spans') as string;
    const spans = JSON.parse(raw) as ClozeSpan[];
    await updateJournalClozeSpans({ id: journal.id, spans });
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await action(formData);
        if (assignmentId && userId) {
          router.push(
            `/admin/articles?assignment_id=${encodeURIComponent(
              assignmentId
            )}&user_id=${encodeURIComponent(userId)}`
          );
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  const canSubmit =
    !parseError &&
    JSON.stringify(journal.cloze_spans) !== JSON.stringify(clozeSpans) &&
    !isPending;

  return (
    <div className='flex flex-col gap-8'>
      <div>
        <div className='p-4 rounded-lg border opacity-50'>
          {JOURNAL_BODY.split('\n').map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </div>
      </div>

      {/* Cloze Spans */}
      <div>
        <h2 className='font-bold mb-2'>Cloze Spans</h2>

        <div className='p-4 rounded-lg border'>
          <div className='whitespace-pre-wrap'>
            {JSON.stringify(clozeSpans)}
          </div>
        </div>
        <div className='mt-2 h-10 overflow-hidden'>
          <form action={handleSubmit}>
            <input
              type='hidden'
              name='spans'
              value={JSON.stringify(clozeSpans)}
            />
            <button
              type='submit'
              className='bg-slate-900 text-white rounded-lg w-full px-3 py-2 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1'
              disabled={!canSubmit}
            >
              <span>送信</span>
              {isPending && <LoaderCircle className='h-4 w-4 animate-spin' />}
            </button>
          </form>
        </div>
      </div>

      {/* Cloze Text */}
      <div className='flex flex-col'>
        <h2 className='font-bold mb-2'>
          Cloze Text
          <span className='ml-2 font-light text-sm text-slate-500'>
            Body with [[ ]]
          </span>
        </h2>
        <textarea
          ref={textareaRef}
          className='border rounded p-4 h-auto resize-none overflow-hidden bg-white focus:outline-0'
          value={clozeText}
          onChange={handleChange}
        />
      </div>

      {/* Cloze Obj Lines */}
      <div>
        <h2 className='font-bold mb-2'>Cloze Obj Lines</h2>

        <div className='p-4 rounded-lg border'>
          <div className='flex flex-col gap-2'>
            {(() => {
              const objlines = !parseError ? clozeObjLines : CLOZE_OBJ_LINES;
              return objlines.map((objs, index) => (
                <div key={index}>
                  <ClozeRow objs={objs} />
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
      <div className='h-24' />
    </div>
  );
};

export default ClozeSpansForm;
