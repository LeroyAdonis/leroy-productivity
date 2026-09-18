import { db } from '@/lib/db';
import RoutineList from '@/components/routine-list';

interface RoutineWithSteps {
  routineId: number;
  routineName: string;
  steps: {
    id: number;
    text: string;
    minutes: number;
    completed: boolean;
  }[];
}

interface RoutineRow {
  routine_id: number;
  routine_name: string;
  step_id: number | null;
  step_text: string | null;
  estimated_minutes: number;
  sort_order: number;
  completed: boolean;
  completed_at: string | null;
}

export const dynamic = 'force-dynamic';

export default async function RoutinePage() {
  const routinesRows = await db.execute(`
    SELECT r.id as routine_id, r.name as routine_name,
           s.id as step_id, s.step_text, s.estimated_minutes, s.sort_order, s.completed, s.completed_at
    FROM daily_routines r
    LEFT JOIN routine_steps s ON s.routine_id = r.id
    WHERE r.is_active = true
    ORDER BY r.sort_order, s.sort_order
  `);

  const byRoutine: Record<string, RoutineWithSteps> = {};
  for (const row of (routinesRows.rows ?? []) as RoutineRow[]) {
    const key = String(row.routine_id);
    if (!byRoutine[key]) {
      byRoutine[key] = { routineId: Number(row.routine_id), routineName: row.routine_name, steps: [] };
    }
    if (row.step_id) {
      byRoutine[key].steps.push({
        id: Number(row.step_id),
        text: row.step_text,
        minutes: Number(row.estimated_minutes),
        completed: row.completed === true,
      });
    }
  }

  const routinesList = Object.values(byRoutine);
  const totalSteps = routinesList.reduce((a, r) => a + r.steps.length, 0);
  const completedSteps = routinesList.reduce((a, r) => a + r.steps.filter(s => s.completed).length, 0);
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)]">
      {/* M3 Top App Bar */}
      <header className="md-top-app-bar px-4">
        <div className="flex-1">
          <h1 className="text-[var(--md-headline-medium)] font-semibold text-[var(--md-on-surface)]">
            Routine
          </h1>
          <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
            {completedSteps}/{totalSteps} steps done today
          </p>
        </div>
      </header>

      <div className="px-4 py-4">
        {/* M3 Progress Bar */}
        <div className="mb-6">
          <div className="md-progress-linear">
            <div
              className="md-progress-linear-indicator"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[var(--md-body-small)] text-[var(--md-on-surface-variant)] mt-2 text-right">
            {Math.round(progressPercent)}%
          </p>
        </div>

        <RoutineList routines={routinesList} />
      </div>
    </div>
  );
}
