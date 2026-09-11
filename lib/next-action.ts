import { db } from '@/lib/db'

export interface NextAction {
  kind: 'step' | 'task' | 'reminder'
  id: number
  text: string
  minutes: number
  dueAt?: string
}

/**
 * Resolve the single highest-priority next action for a user.
 * Priority: 1) first uncompleted routine_step (by sort_order)
 *           2) first task with state='now' (by sort_order)
 *           3) earliest reminder with state in ('due','pending') past remind_at
 */
export async function getNextAction(userId = 1): Promise<NextAction | null> {
  // 1) Check for first uncompleted routine step
  const stepResult = await (db as any).execute(`
    SELECT rs.id, rs.step_text as text, rs.estimated_minutes as minutes
    FROM routine_steps rs
    JOIN daily_routines dr ON dr.id = rs.routine_id
    WHERE dr.user_id = ?
      AND rs.completed = false
    ORDER BY dr.sort_order, rs.sort_order
    LIMIT 1
  `, [userId])

  if (stepResult.rows?.[0]) {
    const row = stepResult.rows[0]
    return {
      kind: 'step',
      id: Number(row.id),
      text: row.text as string,
      minutes: Number(row.minutes),
    }
  }

  // 2) Check for first task with state='now'
  const taskResult = await (db as any).execute(`
    SELECT id, title as text, estimated_minutes as minutes
    FROM tasks
    WHERE user_id = ?
      AND state = 'now'
    ORDER BY sort_order
    LIMIT 1
  `, [userId])

  if (taskResult.rows?.[0]) {
    const row = taskResult.rows[0]
    return {
      kind: 'task',
      id: Number(row.id),
      text: row.title as string,
      minutes: Number(row.minutes),
    }
  }

  // 3) Check for earliest reminder with state in ('due','pending') past remind_at
  const reminderResult = await (db as any).execute(`
    SELECT id, message as text, estimated_minutes as minutes, remind_at as dueAt
    FROM reminders
    WHERE user_id = ?
      AND state IN ('due', 'pending')
      AND remind_at <= datetime('now')
    ORDER BY remind_at ASC
    LIMIT 1
  `, [userId])

  if (reminderResult.rows?.[0]) {
    const row = reminderResult.rows[0]
    return {
      kind: 'reminder',
      id: Number(row.id),
      text: row.message as string,
      minutes: Number(row.minutes) ?? 2, // default 2 min if not set
      dueAt: row.dueAt as string,
    }
  }

  return null
}