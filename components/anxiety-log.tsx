'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function AnxietyLog() {
  const [severity, setSeverity] = useState(5);
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/anxiety/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ severity, note: note.trim() || undefined }),
      });
      if (res.ok) {
        setSaved(true);
        setNote('');
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const label = severity <= 3 ? 'Low' : severity <= 6 ? 'Moderate' : 'High';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Severity</span>
        <span
          className={`text-sm font-semibold ${
            severity <= 3
              ? 'text-primary'
              : severity <= 6
                ? 'text-yellow-500'
                : 'text-red-400'
          }`}
        >
          {severity} / 10 — {label}
        </span>
      </div>

      <Progress
        value={(severity / 10) * 100}
        variant={severity <= 3 ? 'default' : severity <= 6 ? 'secondary' : 'destructive'}
        aria-label={`Anxiety severity: ${severity} out of 10`}
      />

      <input
        type="range"
        min={1}
        max={10}
        value={severity}
        onChange={e => setSeverity(Number(e.target.value))}
        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        aria-label="Severity slider"
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>1 — calm</span>
        <span>10 — panic</span>
      </div>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="What's going on? (optional)"
        rows={3}
        className="w-full bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground border border-input focus:border-ring outline-none resize-none"
        aria-label="Optional note about how you feel"
      />

      <Button
        onClick={handleSave}
        disabled={saving}
        className="w-full"
      >
        {saving ? 'Saving...' : saved ? 'Saved' : 'Log It'}
      </Button>

      {saved && (
        <p className="text-xs text-primary text-center">
          Logged. Thank you for checking in.
        </p>
      )}
    </div>
  );
}
