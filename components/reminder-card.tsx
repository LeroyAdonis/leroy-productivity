'use client';

import { useState } from 'react';

interface ReminderCardProps {
  id: number;
  message: string;
  action: string | null;
  remindAt: string;
  state: string;
  snoozeUntil: string | null;
}

export default function ReminderCard({ id, message, action, remindAt, state, snoozeUntil }: ReminderCardProps) {
  const [gone, setGone] = useState(false);
  const [snoozedMsg, setSnoozedMsg] = useState('');

  const displayTime = snoozeUntil || remindAt;
  const dt = new Date(displayTime);
  const timeLabel = dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const dateLabel = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  const handleSnooze = async (minutes: number) => {
    const res = await fetch('/api/reminders/snooze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, minutes }),
    });
    if (res.ok) {
      const newUntil = new Date(Date.now() + minutes * 60 * 1000);
      setSnoozedMsg(
        `Snoozed. Back at ${newUntil.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
      );
      setTimeout(() => {
        setSnoozedMsg('');
      }, 4000);
    }
  };

  const handleDone = async () => {
    const res = await fetch('/api/reminders/done', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setGone(true);
  };

  const handleDelete = async () => {
    const res = await fetch('/api/reminders/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setGone(true);
  };

  const isOverdue = state === 'due' || new Date(remindAt) <= new Date();

  return (
    <div
      className={`rounded-xl border p-4 ${isOverdue ? 'border-[#00D4AA]/40 bg-[#00D4AA]/5' : 'border-zinc-800 bg-zinc-900/60'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 leading-snug">{message}</p>
          {action && (
            <p className="text-xs text-[#64FFDA] mt-1">{action}</p>
          )}
          <p className="text-xs text-zinc-500 mt-1">
            {dateLabel} at {timeLabel}
          </p>
          {snoozedMsg && (
            <p className="text-xs text-[#64FFDA] mt-1">{snoozedMsg}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={() => handleSnooze(15)}
            className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-[#64FFDA] hover:bg-zinc-700 transition-colors"
          >
            15m
          </button>
          <button
            onClick={() => handleSnooze(60)}
            className="text-xs px-2 py-1 rounded bg-zinc-800 text-zinc-400 hover:text-[#64FFDA] hover:bg-zinc-700 transition-colors"
          >
            1h
          </button>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleDone}
          className="flex-1 text-xs py-1.5 rounded bg-[#00D4AA] text-[#0A0A0F] font-semibold hover:bg-[#64FFDA] transition-colors"
        >
          Done
        </button>
        <button
          onClick={handleDelete}
          className="text-xs px-3 py-1.5 rounded border border-zinc-700 text-zinc-500 hover:text-red-400 hover:border-red-400/40 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}