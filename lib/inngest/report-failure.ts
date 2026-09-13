import { inngest } from "./client";

/**
 * Report an AI failure from the voice flow (Groq Whisper transcription or the
 * NVIDIA parse step).
 *
 * Both failures are currently invisible or non-fatal: an unparseable
 * transcript returns the raw text with `parse_error`, so the feature degrades
 * quietly. This is the signal that it did.
 *
 * Contract: MUST NEVER THROW and never make the caller fail.
 */
export async function reportAiFailure(payload: {
  feature: string;
  errorMessage: string;
  model?: string;
  entityId?: string;
}) {
  try {
    if (!process.env.INNGEST_EVENT_KEY) {
      console.warn("[ai-failure] INNGEST_EVENT_KEY not set — skipping event send");
      return;
    }

    await inngest.send({
      name: "leroy-productivity/ai.failed",
      data: { ...payload, at: new Date().toISOString() },
    });
  } catch (err) {
    console.error("[ai-failure] failed to send Inngest event:", err);
  }
}
