'use client'

import { useState, useEffect } from 'react';
import { listTasks, listRoutineSteps } from '@/lib/queries';
import type { Task } from '@/lib/queries';
import type { RoutineStep } from '@/lib/queries';

import { Button } from '@/components/ui/button';

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
          <span className="flex-1 font-medium text-zinc-200">{t.title}</span>
          <span className="text-[var(--color-muted-foreground)] capitalize text-xs">{t.minutes} min</span>
          {onMoveTask && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveTask(t.id, 'now')}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Move to Now"
            >
              ▶
            </Button>
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
          <span className="flex-1 font-medium text-zinc-200">{t.title}</span>
          <span className="text-[var(--color-muted-foreground)] capitalize text-xs">{t.minutes} min</span>
          {onMoveTask && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onMoveTask(t.id, 'now')}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              title="Move to Now"
            >
              ▶
            </Button>
          )}
        </div>
      ))}
    </div>
  ) : (
    <p className="text-zinc-500 text-xs italic">Nothing later</p>
  );

  const doneCountDisplay = doneCount > 0 ? (
    <p className="text-sm font-medium text-zinc-400">
      <span>{doneCount} done</span>
    </p>
  ) : (
    <p className="text-zinc-500 text-xs italic">Nothing done yet</p>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-zinc-400">Now</h3>
        {nowList}
      </div>

      <div className="rounded-xl border bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-zinc-400">Later</h3>
        {laterList}
      </div>

      <div className="rounded-xl border bg-zinc-900/60 p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider mb-3 text-zinc-400">Done</h3>
        {doneCountDisplay}
      </div>
    </div>
  );
}