import { db } from '@/lib/db';
import ReminderCard from '@/components/reminder-card';

export const dynamic = 'force-dynamic';

export default async function RemindersPage() {
  const now = new Date().toISOString();

  const due = await (db as any).execute(
    `SELECT * FROM reminders WHERE state = 'due' OR remind_at <= '${now}' ORDER BY remind_at ASC`
  );
  const upcoming = await (db as any).execute(
    `SELECT * FROM reminders WHERE state = 'pending' AND remind_at > '${now}' ORDER BY remind_at ASC`
  );
  const snoozed = await (db as any).execute(
    `SELECT * FROM reminders WHERE state = 'snoozed' ORDER BY snooze_until ASC`
  );

  const toCard = (row: any) => ({
    id: Number(row.id),
    message: row.message,
    action: row.action,
    remindAt: row.remind_at,
    state: row.state,
    snoozeUntil: row.snooze_until,
  });

  const dueList = (due.rows ?? []).map(toCard);
  const upcomingList = (upcoming.rows ?? []).map(toCard);
  const snoozedList = (snoozed.rows ?? []).map(toCard);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-[#C8A951]">Reminders</h1>

      <Section title="Due Now" color="text-[#00E859]" items={dueList} empty="Nothing due." />
      <Section title="Upcoming" color="text-zinc-400" items={upcomingList} empty="All clear." />
      <Section title="Snoozed" color="text-[#C8A951]" items={snoozedList} empty="No snoozed reminders." />
    </div>
  );
}

function Section({
  title,
  color,
  items,
  empty,
}: {
  title: string;
  color: string;
  items: { id: number; message: string; action: string | null; remindAt: string; state: string; snoozeUntil: string | null }[];
  empty: string;
}) {
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
              remindAt={item.remindAt}
              state={item.state}
              snoozeUntil={item.snoozeUntil}
            />
          ))}
        </div>
      )}
    </div>
  );
}
