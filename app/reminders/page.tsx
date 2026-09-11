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
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#C8A951]">Reminders</h1>

      <Section title="Due Now" color="text-[#00E859]" items={due} empty="Nothing due." />
      <Section title="Upcoming" color="text-zinc-400" items={upcoming} empty="All clear." />
      <Section title="Snoozed" color="text-[#C8A951]" items={snoozed} empty="No snoozed reminders." />
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
    <div className="mb-8">
      <h2 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${color}`}>{title}</h2>
      {items.length === 0 ? (
        <p className="text-zinc-600 text-sm">{empty}</p>
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
    </div>
  );
}