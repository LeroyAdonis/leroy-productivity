import { db } from '@/lib/db';
import RoutineList from '@/components/routine-list';

export const dynamic = 'force-dynamic';

export default async function RoutinePage() {
  const routinesRows = await db.execute(`\n    SELECT r.id as routine_id, r.name as routine_name,\n           s.id as step_id, s.step_text, s.estimated_minutes, s.sort_order, s.completed, s.completed_at\n    FROM daily_routines r\n    LEFT JOIN routine_steps s ON s.routine_id = r.id\n    WHERE r.is_active = true\n    ORDER BY r.sort_order, s.sort_order\n  `);

  const byRoutine: any = {};
  for (const row of (routinesRows.rows ?? [])) {
    const key = String(row.routine_id);
    if (!byRoutine[key]) {
      byRoutine[key] = { routineId: Number(row.routine_id), routineName: row.routine_name, steps: [] };
    }
    if (row.step_id) {
      byRoutine[key].steps.push({
        id: Number(row.step_id),
        text: row.step_text ?? '',
        minutes: Number(row.estimated_minutes),
        completed: row.completed === true,
      });
    }
  }

  const routinesList = Object.values(byRoutine);
  const totalSteps = routinesList.reduce((a, r) => a + r.steps.length, 0);
  const completedSteps = routinesList.reduce((a, r) => a + r.steps.filter(s => s.completed).length, 0);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-foreground)] px-4 py-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1 text-[#00E859]">Routine</h1>
      <p className="text-zinc-400 text-sm mb-6">
        {completedSteps}/{totalSteps} steps done today
      </p>
      <RoutineList routines={routinesList} />
    </div>
  );
}