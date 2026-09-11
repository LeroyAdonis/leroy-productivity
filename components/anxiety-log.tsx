'use client';

import { useState } from 'react';

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
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-zinc-400">Severity</span>
        <span className={`text-sm font-semibold ${
          severity <= 3 ? 'text-[#00E859]' : severity <= 6 ? 'text-[#C8A951]' : 'text-red-400'
        }`}>
          {severity} / 10 — {label}
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        value={severity}
        onChange={e => setSeverity(Number(e.target.value))}
        className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00E859] mb-4"
      />

      <div className="flex justify-between text-xs text-zinc-600 mb-4">
        <span>1 — calm</span>
        <span>10 — panic</span>
      </div>

      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="What's going on? (optional)"
        rows={3}
        className="w-full bg-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 border border-zinc-700 focus:border-[#00E859] outline-none resize-none mb-4"
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2 rounded-lg bg-[#00E859] text-[#0A0A0B] text-sm font-semibold hover:bg-[#00cc4d] transition-colors disabled:opacity-50"
      >
        {saving ? 'Saving...' : saved ? 'Saved' : 'Log It'}
      </button>

      {saved && (
        <p className="text-xs text-[#00E859] mt-2 text-center">
          Logged. Thank you for checking in.
        </p>
      )}
    </div>
  );
}
