import { ClozeParts, ClozeSpan } from '@/types/dictation';

export function parseCloze(line: string): ClozeParts[] {
  const parts: ClozeParts[] = [];
  const re = /\[\[(.+?)\]\]/g;
  let idx = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(line))) {
    if (m.index > idx) parts.push({ t: 'text', v: line.slice(idx, m.index) });
    parts.push({ t: 'blank', v: m[1] });
    idx = re.lastIndex;
  }
  const tail = line.slice(idx);
  if (tail) parts.push({ t: 'text', v: tail });

  return parts;
}

export function stringifyCloze(parts: ClozeParts[]): string {
  const texts: string[] = [];

  for (const part of parts) {
    if (part.t === 'blank') {
      texts.push(`[[${part.v}]]`);
    } else {
      texts.push(part.v);
    }
  }
  return texts.join('');
}

const cps = (s: string) => Array.from(s);
const normalizeEol = (s: string) => s.replace(/\r\n?/g, '\n');

export function makeClozeText(body: string, spans: ClozeSpan[]): string {
  const arr = cps(body);
  let out = '';
  let i = 0;
  for (const [start, len] of spans) {
    if (start < i) throw new Error('overlap');
    out += arr.slice(i, start).join('');
    out += '[[' + arr.slice(start, start + len).join('') + ']]';
    i = start + len;
  }
  out += arr.slice(i).join('');
  return out;
}

export function parseSpansFromCloze(
  body: string,
  clozeText: string
): ClozeSpan[] {
  const re = /\[\[(.+?)\]\]/g;
  const arr = cps(normalizeEol(body));
  const src = normalizeEol(clozeText);
  const spans: ClozeSpan[] = [];
  let idxCp = 0; // body側の走査位置（コードポイント）
  let srcIdx = 0; // clozeTextの文字インデックス（UTF-16だが正規表現の範囲管理にのみ使用）

  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const before = src.slice(srcIdx, m.index); // [[...]] の手前のテキスト
    // before を body と突き合わせて idxCp を進める
    const beforeCp = cps(before);
    const seg = arr.slice(idxCp, idxCp + beforeCp.length).join('');
    if (seg !== before) throw new Error('原文と問題文が一致しない');
    idxCp += beforeCp.length;

    const blankText = m[1];
    const blankCpLen = cps(blankText).length;
    // 原文の同位置が本当に blankText かチェック（任意）
    const seg2 = arr.slice(idxCp, idxCp + blankCpLen).join('');
    if (seg2 !== blankText) throw new Error('空欄範囲が原文と不一致');
    spans.push([idxCp, blankCpLen]);

    idxCp += blankCpLen;
    srcIdx = re.lastIndex;
  }
  // 末尾のテキスト整合性チェック
  const tail = src.slice(srcIdx);
  const tailCp = cps(tail);
  const segTail = arr.slice(idxCp, idxCp + tailCp.length).join('');
  if (segTail !== tail) throw new Error('末尾が原文と不一致');
  return spans;
}
