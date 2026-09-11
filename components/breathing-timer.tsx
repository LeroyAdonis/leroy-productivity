'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const OPTIONS = [30, 60, 180];

export default function BreathingTimer() {
  const [duration, setDuration] = useState(30);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const reducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  const start = useCallback(() => {
    setRemaining(duration);
    setRunning(true);
  }, [duration]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const progress = running ? (duration - remaining) / duration : 0;
  const circumference = 2 * Math.PI * 54;
  const dashoffset = circumference * (1 - progress);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r="54" fill="none" strokeWidth="4" style={{ stroke: 'var(--border)' }} />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="4"
            style={{ stroke: 'var(--primary)' }}
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={reducedMotion ? '' : 'transition-[stroke-dashoffset] duration-1000 ease-linear'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-mono text-foreground" aria-live="polite" aria-atomic="true">
            {running ? `${mins}:${String(secs).padStart(2, '0')}` : `${duration}s`}
          </span>
        </div>
      </div>

      {running && (
        <Progress value={progress * 100} className="w-full max-w-[200px]" aria-label="Breathing progress" />
      )}

      <div className="flex gap-2" role="radiogroup" aria-label="Timer duration">
        {OPTIONS.map(s => (
          <Button
            key={s}
            variant={duration === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setDuration(s); }}
            disabled={running}
            role="radio"
            aria-checked={duration === s}
            aria-label={`${s} seconds`}
          >
            {s}s
          </Button>
        ))}
      </div>

      <Button
        onClick={running ? stop : start}
        variant={running ? 'secondary' : 'default'}
        size="lg"
        className="min-w-[120px]"
        aria-label={running ? 'Stop breathing timer' : 'Start breathing timer'}
      >
        {running ? 'Stop' : 'Start'}
      </Button>
    </div>
  );
}
