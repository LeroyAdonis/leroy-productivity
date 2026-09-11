'use client'

import { useState, useEffect } from 'react';
import { listTasks, listRoutineSteps } from '@/lib/queries';
import type { Task } from '@/lib/queries';
import type { RoutineStep } from '@/lib/queries';

interface TaskListProps {
  onCompleteStep?: (stepId: number) => void;
  onCompleteTask?: (taskId: number) => void;
  onMoveTask?: (taskId: number, newState: 'now' | 'later' | 'done') => void;
}

export default function TaskList({ onCompleteStep, onCompleteTask, onMoveTask }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>([]);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    async function load() {
      const tRes = await listTasks();
      setTasks(tRes);

      const sRes = await listRoutineSteps();
      setRoutineSteps(sRes);

      const done = tRes.filter((r) => r.state === 'done').length +
        sRes.filter((r) => r.completed).length;
      setDoneCount(done);
    }
    load();
  }, []);

  const nowTasks = tasks.filter((t) => t.state === 'now').slice(0, 5);
  const laterTasks = tasks.filter((t) => t.state === 'later').slice(0, 5);

  const nowList = nowTasks.length > 0 ? (
    <div className="space-y-2 text-sm">
      {nowTasks.map((t) => (
        <div key={t.id} className="flex items-center gap-2">
          <span className="flex-1">{t.title}</span>
          <span className="text-zinc-500 capitalize">{t.minutes} min</span>
          {onMoveTask && (
            <button
              onClick={() => onMoveTask(t.id, 'now')}
              className="text-zinc-600 hover:text-[#00E859] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="Move to Now"
            >
              ▶
            </button>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-zinc-500 text-xs italic">Nothing up next</p>
  );

  const laterList = laterTasks.length > 0 ? (
    <div className="space-y-2 text-sm">
      {laterTasks.map((t) => (
        <div key={t.id} className="flex items-center gap-2">
          <span className="flex-1">{t.title}</span>
          <span className="text-zinc-500 capitalize">{t.minutes} min</span>
          {onMoveTask && (
            <button
              onClick={() => onMoveTask(t.id, 'now')}
              className="text-zinc-600 hover:text-[#00E859] text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="Move to Now"
            >
              ▶
            </button>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-zinc-500 text-xs italic">Nothing later</p>
  );

  const doneList = doneCount > 0 ? (
    <div className="text-sm text-zinc-500">
      <span>{doneCount} done</span>
    </div>
  ) : (
    <p className="text-zinc-500 text-xs italic">Nothing done yet</p>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Now</h3>
        {nowList}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Later</h3>
        {laterList}
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Done</h3>
        {doneList}
      </div>
    </div>
  );
}