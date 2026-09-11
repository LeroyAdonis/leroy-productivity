import { listTasks } from '@/lib/queries';
import TaskItem from '@/components/task-item';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await listTasks();

  const nowTasks = tasks.filter(t => t.state === 'now').slice(0, 5);
  const laterTasks = tasks.filter(t => t.state === 'later').slice(0, 5);
  const doneTasks = tasks.filter(t => t.state === 'done');

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#C8A951]">Tasks</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-zinc-400">Now</h2>
          {nowTasks.length > 0 ? (
            <div className="space-y-2 text-sm">
              {nowTasks.map(t => <TaskItem key={t.id} task={t} />)}
            </div>
          ) : (
            <p className="text-zinc-500 text-xs italic">Nothing up next</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-zinc-400">Later</h2>
          {laterTasks.length > 0 ? (
            <div className="space-y-2 text-sm">
              {laterTasks.map(t => <TaskItem key={t.id} task={t} />)}
            </div>
          ) : (
            <p className="text-zinc-500 text-xs italic">Nothing later</p>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 text-zinc-400">Done</h2>
          {doneTasks.length > 0 ? (
            <div className="text-sm text-zinc-500 space-y-1">
              {doneTasks.map(t => (
                <div key={t.id}>{t.title} — done</div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-xs italic">Nothing done yet</p>
          )}
        </div>
      </div>
    </div>
  );
}