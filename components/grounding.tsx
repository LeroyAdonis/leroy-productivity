'use client';

import { useState } from 'react';

const STEPS = [
  { count: 5, sense: 'things you can see', icon: '👁' },
  { count: 4, sense: 'things you can touch', icon: '✋' },
  { count: 3, sense: 'things you can hear', icon: '👂' },
  { count: 2, sense: 'things you can smell', icon: '👃' },
  { count: 1, sense: 'thing you can taste', icon: '👅' },
];

export default function Grounding() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => { setCurrent(0); setDone(false); };

  if (done) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 text-center">
        <p className="text-[#00E859] font-semibold mb-2">You&#39;re grounded.</p>
        <p className="text-sm text-zinc-400 mb-4">
          You&#39;ve anchored yourself to the present moment.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
        >
          Start over
        </button>
      </div>
    );
  }

  const step = STEPS[current];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{step.icon}</span>
        <div>
          <p className="text-sm text-zinc-400">
            Step {current + 1} of {STEPS.length}
          </p>
          <p className="text-lg font-semibold text-zinc-100">
            Name {step.count} {step.sense}
          </p>
        </div>
      </div>

      <p className="text-xs text-zinc-500 mb-4">
        Take your time. There&#39;s no rush.
      </p>

      <div className="flex gap-2">
        {current > 0 && (
          <button
            onClick={() => setCurrent(c => c - 1)}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
          >
            Back
          </button>
        )}
        <button
          onClick={() => {
            if (current === STEPS.length - 1) setDone(true);
            else setCurrent(c => c + 1);
          }}
          className="flex-1 px-4 py-2 rounded-lg bg-[#00E859] text-[#0A0A0B] text-sm font-semibold hover:bg-[#00cc4d] transition-colors"
        >
          {current === STEPS.length - 1 ? 'Done' : 'Next'}
        </button>
      </div>
    </div>
  );
}
