'use client';

import { useState, useTransition } from 'react';

interface Step {
  id: number;
  text: string;
  minutes: number;
  completed: boolean;
}

interface Routine {
  routineId: number;
  routineName: string;
  steps: Step[];
}

export default function RoutineList({ routines }: { routines: Routine[] }) {
  const [data, setData] = useState<Routine[]>(routines);
  // const [isPending, startTransition] = useTransition(); // preserved for future async updates

  const toggleStep = (routineId: number, stepId: number) => {
    setData(prev =>
      prev.map(r =>
        r.routineId === routineId
          ? { ...r, steps: r.steps.map(s => (s.id === stepId ? { ...s, completed: !s.completed } : s)) }
          : r
      )
    );
    startTransition(async () => {
      await fetch('/api/routine/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      });
    });
  };

  const updateStep = (routineId: number, stepId: number, fields: Partial<Step>) => {
    setData(prev =>
      prev.map(r =>
        r.routineId === routineId
          ? { ...r, steps: r.steps.map(s => (s.id === stepId ? { ...s, ...fields } : s)) }
          : r
      )
    );
    startTransition(async () => {
      await fetch('/api/routine/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId, ...fields }),
      });
    });
  };

  const addStep = (routineId: number, text: string, minutes: number) => {
    if (!text.trim()) return;
    setData(prev =>
      prev.map(r =>
        r.routineId === routineId
          ? { ...r, steps: [...r.steps, { id: Date.now(), text: text.trim(), minutes, completed: false }] }
          : r
      )
    );
    startTransition(async () => {
      const res = await fetch('/api/routine/add-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routineId, text: text.trim(), minutes }),
      });
      if (res.ok) {
        const { id } = await res.json();
        setData(prev =>
          prev.map(r =>
            r.routineId === routineId
              ? { ...r, steps: r.steps.map(s => (s.id === Date.now() ? { ...s, id } : s)) }
              : r
          )
        );
      }
    });
  };

  const removeStep = (routineId: number, stepId: number) => {
    setData(prev =>
      prev.map(r =>
        r.routineId === routineId ? { ...r, steps: r.steps.filter(s => s.id !== stepId) } : r
      )
    );
    startTransition(async () => {
      await fetch('/api/routine/remove-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stepId }),
      });
    });
  };

  return (
    <div className="space-y-6">
      {data.map(routine => (
        <RoutineSection
          key={routine.routineId}
          routine={routine}
          onToggle={toggleStep}
          onUpdate={updateStep}
          onAdd={addStep}
          onRemove={removeStep}
        />
      ))}
    </div>
  );
}

function RoutineSection({
  routine,
  onToggle,
  onUpdate,
  onAdd,
  onRemove,
}: {
  routine: Routine;
  onToggle: (r: number, s: number) => void;
  onUpdate: (r: number, s: number, f: Partial<Step>) => void;
  onAdd: (r: number, t: string, m: number) => void;
  onRemove: (r: number, s: number) => void;
}) {
  const [newText, setNewText] = useState('');
  const [newMins, setNewMins] = useState(2);
  const done = routine.steps.filter(s => s.completed).length;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-zinc-100">{routine.routineName}</h2>
        <span className="text-xs text-zinc-500">
          {done}/{routine.steps.length}
        </span>
      </div>
      <ul className="space-y-2">
        {routine.steps.map(step => (
          <li key={step.id} className="flex items-center gap-3 group">
            <button
              onClick={() => onToggle(routine.routineId, step.id)}
              className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                step.completed
                  ? 'bg-[#00E859] border-[#00E859]'
                  : 'border-zinc-600 hover:border-[#00E859]'
              }`}
            >
              {step.completed && <span className="text-[#0A0A0B] text-xs font-bold">&#10003;</span>}
            </button>
            <input
              value={step.text}
              onChange={e => onUpdate(routine.routineId, step.id, { text: e.target.value })}
              className={`flex-1 bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-[#00E859] outline-none text-sm transition-colors ${
                step.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
              }`}
            />
            <input
              type="number"
              min={1}
              max={60}
              value={step.minutes}
              onChange={e => onUpdate(routine.routineId, step.id, { minutes: Number(e.target.value) })}
              className="w-12 bg-zinc-800 rounded text-xs text-center text-zinc-400 py-1 border border-zinc-700 focus:border-[#00E859] outline-none"
            />
            <span className="text-xs text-zinc-600">m</span>
            <button
              onClick={() => onRemove(routine.routineId, step.id)}
              className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex gap-2">
        <input
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && newText.trim()) {
              onAdd(routine.routineId, newText, newMins);
              setNewText('');
            }
          }}
          placeholder="Add step..."
          className="flex-1 bg-zinc-800 rounded px-3 py-1.5 text-sm text-zinc-200 placeholder:text-zinc-600 border border-zinc-700 focus:border-[#00E859] outline-none"
        />
        <input
          type="number"
          min={1}
          max={60}
          value={newMins}
          onChange={e => setNewMins(Number(e.target.value))}
          className="w-14 bg-zinc-800 rounded text-xs text-center text-zinc-400 border border-zinc-700 focus:border-[#00E859] outline-none"
        />
        <button
          onClick={() => {
            if (newText.trim()) {
              onAdd(routine.routineId, newText, newMins);
              setNewText('');
            }
          }}
          className="px-3 py-1.5 bg-[#00E859] text-[#0A0A0B] text-sm font-semibold rounded hover:bg-[#00cc4d] transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
