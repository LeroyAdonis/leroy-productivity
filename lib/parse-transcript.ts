// lib/parse-transcript.ts — sends transcript to Nvidia DeepSeek to parse into typed items
export interface ParsedItem {
  type: 'task' | 'reminder' | 'routine_step' | 'anxiety_log';
  text: string;
  minutes: number | null;
  due_at: string | null;
}

const SYSTEM_PROMPT = `You parse a spoken voice memo from a person with ADHD into concrete productivity items.
Return a JSON object with a single key "items" that is an array of items. Each item has:
- "type": one of "task", "reminder", "routine_step", "anxiety_log"
- "text": a short, clear action string (imperative, no preamble)
- "minutes": an integer minutes estimate (1-60), or null if not applicable
- "due_at": an ISO 8601 datetime if the user mentioned a specific time/date, else null

Rules:
- A task is a one-off thing to do now or later (default minutes 5 if unclear).
- A reminder is time-sensitive ("remind me at 2pm to X"); set due_at and keep text as the action.
- A routine_step is a small daily habit (brushing teeth, meds, exercise); minutes 1-5.
- An anxiety_log is only when the user is describing feelings/anxiety, not an action — capture severity hint in text and leave minutes/due_at null.
- If nothing actionable is said, return items: [].
- Be concrete, strip filler words, never invent times that weren't spoken.`;

export async function parseTranscript(transcript: string): Promise<ParsedItem[]> {
  const key = process.env.NVIDIA_API_KEY;
  const base = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
  if (!key) throw new Error('NVIDIA_API_KEY is not set');

  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'deepseek-ai/deepseek-v4-pro-0813',
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Nvidia parse failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Nvidia returned empty content');

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error('Nvidia returned invalid JSON: ' + content.slice(0, 200));
  }

  const items: ParsedItem[] = Array.isArray(parsed.items) ? parsed.items : [];
  return items
    .filter((it: any) => it && typeof it.text === 'string' && it.text.trim().length > 0)
    .map((it: any) => ({
      type: ['task', 'reminder', 'routine_step', 'anxiety_log'].includes(it.type) ? it.type : 'task',
      text: String(it.text).trim(),
      minutes: Number.isInteger(it.minutes) ? Math.min(60, Math.max(1, it.minutes)) : null,
      due_at: typeof it.due_at === 'string' && it.due_at ? it.due_at : null,
    }));
}