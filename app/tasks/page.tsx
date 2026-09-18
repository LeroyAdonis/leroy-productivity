import { listTasks } from '@/lib/queries';
import TaskItem from '@/components/task-item';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  const tasks = await listTasks();

  const nowTasks = tasks.filter(t => t.state === 'now').slice(0, 5);
  const laterTasks = tasks.filter(t => t.state === 'later').slice(0, 5);
  const doneTasks = tasks.filter(t => t.state === 'done');

  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)]">
      {/* M3 Top App Bar */}
      <header className="md-top-app-bar px-4">
        <h1 className="text-[var(--md-headline-medium)] font-semibold text-[var(--md-on-surface)]">
          Tasks
        </h1>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Now Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[var(--md-error)]" />
            <h2 className="text-[var(--md-title-small)] font-medium uppercase tracking-wider text-[var(--md-on-surface-variant)]">
              Now
            </h2>
          </div>
          {nowTasks.length > 0 ? (
            <div className="space-y-2">
              {nowTasks.map(t => <TaskItem key={t.id} task={t} />)}
            </div>
          ) : (
            <div className="md-card md-card-filled p-4 text-center">
              <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
                Nothing up next
              </p>
            </div>
          )}
        </section>

        {/* Later Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[var(--md-primary)]" />
            <h2 className="text-[var(--md-title-small)] font-medium uppercase tracking-wider text-[var(--md-on-surface-variant)]">
              Later
            </h2>
          </div>
          {laterTasks.length > 0 ? (
            <div className="space-y-2">
              {laterTasks.map(t => <TaskItem key={t.id} task={t} />)}
            </div>
          ) : (
            <div className="md-card md-card-filled p-4 text-center">
              <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
                Nothing later
              </p>
            </div>
          )}
        </section>

        {/* Done Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[var(--md-secondary)]" />
            <h2 className="text-[var(--md-title-small)] font-medium uppercase tracking-wider text-[var(--md-on-surface-variant)]">
              Done
            </h2>
          </div>
          {doneTasks.length > 0 ? (
            <div className="space-y-2">
              {doneTasks.map(t => (
                <div key={t.id} className="md-card md-card-filled p-3 opacity-60">
                  <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)] line-through">
                    {t.title}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="md-card md-card-filled p-4 text-center">
              <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
                Nothing done yet
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
