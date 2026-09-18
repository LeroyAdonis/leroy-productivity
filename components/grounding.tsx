'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const STEPS = [
  { count: 5, sense: 'things you can see' },
  { count: 4, sense: 'things you can touch' },
  { count: 3, sense: 'things you can hear' },
  { count: 2, sense: 'things you can smell' },
  { count: 1, sense: 'thing you can taste' },
];

export default function Grounding() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);

  const reset = () => { setCurrent(0); setDone(false); };

  if (done) {
    return (
      <div className="text-center py-4">
        <p className="text-primary font-semibold mb-2">You&#39;re grounded.</p>
        <p className="text-sm text-muted-foreground mb-4">
          You&#39;ve anchored yourself to the present moment.
        </p>
        <Button variant="outlined" onClick={reset}>
          Start over
        </Button>
      </div>
    );
  }

  const step = STEPS[current];

  return (
    <div className="flex flex-col gap-4">
      <Progress
        value={((current + 1) / STEPS.length) * 100}
        aria-label={`Step ${current + 1} of ${STEPS.length}`}
      />

      <div>
        <p className="text-sm text-muted-foreground mb-1">
          Step {current + 1} of {STEPS.length}
        </p>
        <p className="text-lg font-semibold text-foreground">
          Name {step.count} {step.sense}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        Take your time. There&#39;s no rush.
      </p>

      <div className="flex gap-2">
        {current > 0 && (
          <Button variant="outlined" onClick={() => setCurrent(c => c - 1)}>
            Back
          </Button>
        )}
        <Button
          className="flex-1"
          onClick={() => {
            if (current === STEPS.length - 1) setDone(true);
            else setCurrent(c => c + 1);
          }}
        >
          {current === STEPS.length - 1 ? 'Done' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
