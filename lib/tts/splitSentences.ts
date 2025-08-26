export function splitIntoSentences(raw: string): string[] {
  const normalized = raw.replace(/\r\n?/g, '\n').replace(/\u3000/g, ' ');

  const isBreak = (ch: string) => /[。．\.！!？\?]/.test(ch);
  const openers = new Set(['「', '『']);
  const matchCloser: Record<string, string> = { '」': '「', '』': '『' };

  const out: string[] = [];
  let buf = '';
  const stack: string[] = []; // 引用の深さ（「」「」「…」）

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];

    if (openers.has(ch)) stack.push(ch);
    else if (ch in matchCloser) {
      if (stack[stack.length - 1] === matchCloser[ch]) stack.pop();
      else stack.length = Math.max(0, stack.length - 1); // 不整合に強く
    }

    if (ch === '\n') {
      if (buf.trim()) out.push(buf.replace(/\s+/g, ' ').trim());
      buf = '';
      continue;
    }

    buf += ch;

    // 「」等の外側だけで区切る
    if (isBreak(ch) && stack.length === 0) {
      // 連続句読点をまとめて吸収（例: "!?")
      while (i + 1 < normalized.length && isBreak(normalized[i + 1])) {
        i++;
        buf += normalized[i];
      }
      out.push(buf.replace(/\s+/g, ' ').trim());
      buf = '';
    }
  }

  if (buf.trim()) out.push(buf.replace(/\s+/g, ' ').trim());
  return out.filter((s) => s.length > 0);
}
