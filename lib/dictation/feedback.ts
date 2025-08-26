export async function submitFeedbackOnce(params: {
  sentenceId: string;
  sentenceScript: string;
  userAnswer: string;
}): Promise<{ ok: boolean; feedbackMarkdown?: string }> {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) return { ok: false };
  const data = (await res.json()) as { feedbackMarkdown: string };
  return { ok: true, feedbackMarkdown: data.feedbackMarkdown };
}
