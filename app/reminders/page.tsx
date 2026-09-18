import { listReminders } from '@/lib/queries';
import ReminderCard from '@/components/reminder-card';

interface Reminder {
  id: number;
  message: string;
  action?: string | null;
  remind_at: string;
  state: string;
  estimated_minutes?: number;
  snooze_until?: string | null;
}

export const dynamic = 'force-dynamic';

export default async function RemindersPage() {
  const now = new Date().toISOString();

  const allReminders = await listReminders();

  const due = allReminders.filter(r =>
    r.state === 'due' || new Date(r.remind_at) <= new Date()
  );
  const upcoming = allReminders.filter(r =>
    r.state === 'pending' && new Date(r.remind_at) > new Date()
  );
  const snoozed = allReminders.filter(r => r.state === 'snoozed');

  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)]">
      {/* M3 Top App Bar */}
      <header className="md-top-app-bar px-4">
        <h1 className="text-[var(--md-headline-medium)] font-semibold text-[var(--md-on-surface)]">
          Reminders
        </h1>
      </header>

      <div className="px-4 py-4 space-y-6">
        <Section title="Due Now" color="bg-[var(--md-error)]" items={due} empty="Nothing due." />
        <Section title="Upcoming" color="bg-[var(--md-primary)]" items={upcoming} empty="All clear." />
        <Section title="Snoozed" color="bg-[var(--md-tertiary)]" items={snoozed} empty="No snoozed reminders." />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  color: string;
  items: Reminder[];
  empty: string;
}

function Section({ title, color, items, empty }: SectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h2 className="text-[var(--md-title-small)] font-medium uppercase tracking-wider text-[var(--md-on-surface-variant)]">
          {title}
        </h2>
      </div>
      {items.length === 0 ? (
        <div className="md-card md-card-filled p-4 text-center">
          <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
            {empty}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <ReminderCard
              key={item.id}
              id={item.id}
              message={item.message}
              action={item.action}
              remindAt={item.remind_at}
              state={item.state}
              snoozeUntil={item.snooze_until}
            />
          ))}
        </div>
      )}
    </section>
  );
}
