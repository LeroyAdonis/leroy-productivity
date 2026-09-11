'use client'

import { useState } from 'react';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  minutes: number;
  state: 'now' | 'later' | 'done';
}

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const moveTask = async (newState: 'now' | 'later' | 'done') => {
    setLoading(true);
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, state: newState }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 py-1">
      <span className="flex-1">{task.title}</span>
      <span className="text-zinc-500 text-xs">{task.minutes}m</span>
      <div className="flex gap-1">
        {task.state !== 'now' && (
          <button
            onClick={() => moveTask('now')}
            disabled={loading}
            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-[#00E859] transition-colors"
          >
            Now
          </button>
        )}
        {task.state !== 'later' && (
          <button
            onClick={() => moveTask('later')}
            disabled={loading}
            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-[#C8A951] transition-colors"
          >
            Later
          </button>
        )}
        {task.state !== 'done' && (
          <button
            onClick={() => moveTask('done')}
            disabled={loading}
            className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 hover:text-green-400 transition-colors"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
}