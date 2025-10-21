'use client';
import { updateJournalClozeSpans } from '@/app/admin/journals/[id]/actions';
import ClozeRow from '@/components/cloze/ClozeRow';
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

type Props = {
  journal: Journal;
};

const ClozeSpansUserForm = ({ journal }: Props) => {
  const CLOZE_OBJ_LINES = useMemo(() => {
    const _clozeText = makeClozeText(journal.body, journal.cloze_spans);
    return _clozeText
      .split('\n')
      .filter(Boolean)
      .map((clozeText) => parseCloze(clozeText));
  }, [journal]);

  const router = useRouter();

  const [clozeText, setClozeText] = useState('');
  const [clozeSpans, setClozeSpans] = useState<ClozeSpan[]>([]);
  const [clozeObjLines, setClozeObjLines] = useState<ClozeObjLine[]>([]);
  const [parseError, setParseError] = useState('');

  const [isPending, startTransition] = useTransition();

  const deriveFromText = (body: string, text: string) => {
    const spans = parseSpansFromCloze(body, text);
    const objLines: ClozeObjLine[] = text
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(parseCloze);
    return { text, spans, objLines };
  };

  const deriveFromJournal = (j: Journal) => {
    const text = makeClozeText(j.body, j.cloze_spans);
    const objLines: ClozeObjLine[] = text
      .split('\n')
      .filter(Boolean)
      .map(parseCloze);
    return { text, spans: j.cloze_spans as ClozeSpan[], objLines };
  };

  const baseline = useMemo(() => deriveFromJournal(journal), [journal]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // clozeText, clozeSpans, clozeParts の初期化
  useEffect(() => {
    setClozeText(baseline.text);
    setClozeSpans(baseline.spans);
    setClozeObjLines(baseline.objLines);
    setParseError('');
  }, [baseline]);

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
      const { spans, objLines } = deriveFromText(journal.body, next);
      setClozeSpans(spans);
      setClozeObjLines(objLines);
    } catch (err) {
      setParseError(err instanceof Error ? err.message : String(err));
    }
  };

  const handleReset = () => {
    setClozeText(baseline.text);
    setClozeSpans(baseline.spans);
    setClozeObjLines(baseline.objLines);
    setParseError('');
  };

  async function action(formData: FormData) {
    const raw = formData.get('spans') as string;
    const spans = JSON.parse(raw) as ClozeSpan[];
    await updateJournalClozeSpans({ id: journal.id, spans });
  }

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await action(formData);
      router.push('/');
    });
  };

  const canSubmit = useMemo(() => {
    if (parseError) return false;
    if (isPending) return false;
    return JSON.stringify(journal.cloze_spans) !== JSON.stringify(clozeSpans);
  }, [parseError, isPending, journal.cloze_spans, clozeSpans]);

  return (
    <div className='flex flex-col gap-8'>
      {/* Cloze Text */}
      <div className='flex flex-col'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold mb-2'>填空標記</h2>
          <button
            className='text-xs border py-1.5 rounded px-2 cursor-pointer hover:bg-slate-200 text-slate-700'
            onClick={handleReset}
          >
            恢復原狀
          </button>
        </div>
        <div className='font-light text-sm text-slate-500 mb-2'>
          <div>請把要留空的詞用 [[ ]] 圍起來。</div>
          <div>只能使用 [[ ]] 標出空格，若修改或刪除原文內容將無法儲存。</div>
          <div className='mt-1 pl-[1em]'>
            <span>{`例如) これは何ですか。`}</span>
            <span className='pr-2'>{`->`}</span>
            <span>{`[[これ]]は[[何]]ですか。`}</span>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          className='border rounded p-4 h-auto resize-none overflow-hidden bg-white focus:outline-0'
          value={clozeText}
          onChange={handleChange}
        />
      </div>

      {/* Cloze Obj Lines */}
      <div>
        <h2 className='text-xl font-bold mb-2'>題目預覽</h2>

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

      <div className='mt-2 '>
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
            <span>儲存變更</span>
            {isPending && <LoaderCircle className='h-4 w-4 animate-spin' />}
          </button>
        </form>
      </div>
      <div className='h-24' />
    </div>
  );
};

export default ClozeSpansUserForm;
