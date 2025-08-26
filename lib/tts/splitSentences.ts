export function splitIntoSentences(raw: string): string[] {
  const normalized = raw.replace(/\r\n?/g, '\n').replace(/\u3000/g, ' ');

  const pattern = /(?<=。|．|\.|！|!|？|\?)|\n+/g;

  return normalized
    .split(pattern)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 0);
}
