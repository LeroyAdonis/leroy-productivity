'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const OPTIONS = [30, 60, 180];

export default function BreathingTimer() {
  const [duration, setDuration] = useState(30);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a1a" strokeWidth="4" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#00E859"
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={reducedMotion ? '' : 'transition-[stroke-dashoffset] duration-1000 ease-linear'}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-mono text-zinc-200">
            {mins}:{String(secs).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {OPTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setDuration(s); }}
            disabled={running}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              duration === s
                ? 'bg-[#00E859] text-[#0A0A0B]'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            } ${running ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {s}s
          </button>
        ))}
      </div>

      <button
        onClick={running ? stop : start}
        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
          running
            ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            : 'bg-[#00E859] text-[#0A0A0B] hover:bg-[#00cc4d]'
        }`}
      >
        {running ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
