// app/api/voice/route.ts — receive audio → Groq Whisper transcribe → Nvidia DeepSeek parse
import { NextRequest, NextResponse } from 'next/server';
import { parseTranscript } from '@/lib/parse-transcript';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart form with audio.' }, { status: 400 });
  }

  const audio = formData.get('audio');
  if (!(audio instanceof Blob) || audio.size === 0) {
    return NextResponse.json(
      { error: "Couldn't hear anything — the recording was empty. Try again." },
      { status: 400 },
    );
  }

  // 1) Transcribe with Groq Whisper
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey) {
    return NextResponse.json({ error: 'GROQ_API_KEY is not set.' }, { status: 500 });
  }

  const transcript = await transcribe(groqKey, audio);
  if (!transcript || transcript.trim().length === 0) {
    return NextResponse.json(
      { error: "Couldn't hear anything — try again, a little closer to the mic." },
      { status: 422 },
    );
  }

  // 2) Parse with Nvidia DeepSeek
  try {
    const items = await parseTranscript(transcript);
    return NextResponse.json({ transcript, items });
  } catch (err) {
    // Parse failure is non-fatal: return the raw transcript so the UI can offer manual add
    return NextResponse.json({
      transcript,
      items: [],
      parse_error: (err as Error).message,
    });
  }
}

async function transcribe(groqKey: string, audio: Blob): Promise<string> {
  const fd = new FormData();
  // MediaRecorder in Chrome/Firefox produces audio/webm (opus); Groq accepts webm/opus/mp3/m4a/wav
  fd.append('file', audio, 'voice.webm');
  fd.append('model', 'whisper-large-v3');
  fd.append('response_format', 'json');

  const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${groqKey}` },
    body: fd,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Groq transcription failed (${res.status}): ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.text || '';
}