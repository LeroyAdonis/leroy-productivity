import { db } from '@/lib/db'

export interface Task {
  id: number
  title: string
  estimated_minutes?: number
  state?: 'now' | 'later' | 'done'
  project_tag?: string
}

/** List all tasks for a user */
export async function listTasks(userId = 1): Promise<Task[]> {
  const res = await (db as any).execute(
    `SELECT id, title, estimated_minutes, state, project_tag, sort_order FROM tasks WHERE user_id = ? ORDER BY sort_order, id`,
    [userId]
  )
  return res.rows ?? []
}

/** Create a new task */
export async function createTask(userId: number, title: string, estimated_minutes = 2, state: 'now' | 'later' = 'now', project_tag?: string): Promise<Task> {
  const res = await (db as any).execute(
    `INSERT INTO tasks (user_id, title, estimated_minutes, state, project_tag, sort_order) VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tasks WHERE user_id = ?))`,
    [userId, title, estimated_minutes, state, project_tag, userId]
  )
  const row = res.rows?.[0]
  if (!row) throw new Error('Failed to create task')
  return { id: Number(row.id), title, estimated_minutes, state, project_tag }
}

/** Move a task to a new state/sort order */
export async function moveTask(taskId: number, newState: 'now' | 'later' | 'done', userId = 1): Promise<void> {
  await (db as any).execute(
    `UPDATE tasks SET state = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
    [newState, taskId, userId]
  )
}

/** Complete a task (set state='done') */
export async function completeTask(taskId: number, userId = 1): Promise<void> {
  await (db as any).execute(
    `UPDATE tasks SET state = 'done', updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
    [taskId, userId]
  )
}

/** List all routine steps */
export async function listRoutineSteps(userId = 1): Promise<{ id: number; text: string; estimated_minutes: number; completed: boolean }[]> {
  const res = await (db as any).execute(`
    SELECT rs.id, rs.step_text as text, rs.estimated_minutes as estimated_minutes, rs.completed as completed
    FROM routine_steps rs
    JOIN daily_routines dr ON dr.id = rs.routine_id
    WHERE dr.user_id = ?
    ORDER BY dr.sort_order, rs.sort_order
  `, [userId])
  return res.rows ?? []
}

/** List all reminders */
export async function listReminders(userId = 1): Promise<{ id: number; message: string; estimated_minutes?: number; remind_at: string; state: string }[]> {
  const res = await (db as any).execute(`
    SELECT id, message, estimated_minutes as estimated_minutes, remind_at, state
    FROM reminders
    WHERE user_id = ?
    ORDER BY remind_at ASC
  `, [userId])
  return res.rows ?? []
}

/** Move a routine step's sort order */
export async function moveStep(stepId: number, newSortOrder: number, userId = 1): Promise<void> {
  await (db as any).execute(
    `UPDATE routine_steps SET sort_order = ? WHERE id = ? AND (SELECT user_id FROM daily_routines WHERE id = routine_id) = ?`,
    [newSortOrder, stepId, userId]
  )
}

/** Complete a routine step */
export async function completeStep(stepId: number, userId = 1): Promise<void> {
  await (db as any).execute(
    `UPDATE routine_steps SET completed = true, completed_at = datetime('now') WHERE id = ? AND (SELECT user_id FROM daily_routines WHERE id = routine_id) = ?`,
    [stepId, userId]
  )
}