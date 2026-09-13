import { inngest } from "./client";

/**
 * Alert on a leroy-productivity AI failure.
 *
 * No email helper exists here, so this adds no mail dependency: one structured
 * console line, plus a webhook POST only when AI_ALERT_WEBHOOK_URL is set.
 */
export const aiFailureAlert = inngest.createFunction(
  {
    id: "ai-failure-alert",
    triggers: [{ event: "leroy-productivity/ai.failed" }],
    onFailure: async ({ error }) => {
      console.error("[inngest] aiFailureAlert failed:", error);
    },
  },
  async ({ event, step }) => {
    await step.run("report-ai-failure", async () => {
      const data = (event.data ?? {}) as {
        feature?: string;
        errorMessage?: string;
        model?: string;
        entityId?: string;
        at?: string;
      };

      const summary = {
        source: "leroy-productivity",
        feature: data.feature ?? "unknown",
        model: data.model ?? "unknown",
        errorMessage: data.errorMessage ?? "unknown",
        entityId: data.entityId ?? null,
        at: data.at ?? new Date().toISOString(),
      };

      console.error("[ai-failure-alert]", JSON.stringify(summary));

      const webhook = process.env.AI_ALERT_WEBHOOK_URL;
      if (!webhook) return;

      try {
        await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(summary),
        });
      } catch (err) {
        console.warn("[ai-failure-alert] webhook delivery failed:", err);
      }
    });
  }
);
