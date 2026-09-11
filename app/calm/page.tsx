import BreathingTimer from '@/components/breathing-timer';
import Grounding from '@/components/grounding';
import AnxietyLog from '@/components/anxiety-log';

export const dynamic = 'force-dynamic';

export default async function CalmPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 text-[#00E859]">Calm</h1>
      <p className="text-zinc-500 text-sm mb-6">Take a moment. You&#39;re safe here.</p>

      <div className="space-y-8">
        <section className="rounded-xl border border-[#00E859]/30 bg-[#00E859]/5 p-6">
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">I&#39;m overwhelmed</h2>
          <p className="text-sm text-zinc-400 mb-4">
            You don&#39;t have to do everything at once. Start with one of these:
          </p>
          <ol className="space-y-4 list-decimal list-inside text-sm text-zinc-300">
            <li>
              <span className="font-medium text-[#00E859]">Breathe</span> — use the timer below to
              slow down.
            </li>
            <li>
              <span className="font-medium text-[#00E859]">Ground yourself</span> — the 5-4-3-2-1
              exercise brings you back to the present.
            </li>
            <li>
              <span className="font-medium text-[#00E859]">Log it</span> — writing down how you feel
              takes the weight off.
            </li>
          </ol>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Breathing Timer
          </h2>
          <BreathingTimer />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            5-4-3-2-1 Grounding
          </h2>
          <Grounding />
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-3">
            Log How You Feel
          </h2>
          <AnxietyLog />
        </section>
      </div>
    </div>
  );
}
