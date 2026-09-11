import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

/** List all tasks for a user */
export async function listTasks(userId = 1): Promise<Array<{id: number; title: string; estimated_minutes?: number; state?: 'now' | 'later' | 'done'; project_tag?: string; sort_order: number}>> {
  const res = await db.execute(sql`
    SELECT id, title, estimated_minutes, state, project_tag, sort_order 
    FROM tasks 
    WHERE user_id = ${userId} 
    ORDER BY sort_order, id
  `)
  return res.rows ?? []
}

/** Create a new task */
export async function createTask(userId: number, title: string, estimated_minutes = 2, state: 'now' | 'later' = 'now', project_tag?: string): Promise<{id: number; title: string; estimated_minutes: number; state: 'now' | 'later'; project_tag?: string}> {
  const res = await db.execute(sql`
    INSERT INTO tasks (user_id, title, estimated_minutes, state, project_tag, sort_order)
    VALUES (${userId}, ${title}, ${estimated_minutes}, ${state}, ${project_tag ?? null}, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tasks WHERE user_id = ${userId}))
    RETURNING id, title, estimated_minutes, state, project_tag
  `)
  const row = res.rows?.[0]
  if (!row) throw new Error('Failed to create task')
  return { id: Number(row.id), title: row.title, estimated_minutes: row.estimated_minutes, state: row.state, project_tag: row.project_tag }
}

/** Move a task to a new state/sort order */
export async function moveTask(taskId: number, newState: 'now' | 'later' | 'done', userId = 1): Promise<void> {
  await db.execute(sql`
    UPDATE tasks 
    SET state = ${newState}, updated_at = NOW() 
    WHERE id = ${taskId} AND user_id = ${userId}
  `)
}

/** Complete a task (set state='done') */
export async function completeTask(taskId: number, userId = 1): Promise<void> {
  await db.execute(sql`
    UPDATE tasks 
    SET state = 'done', updated_at = NOW() 
    WHERE id = ${taskId} AND user_id = ${userId}
  `)
}

/** List all routine steps */
export async function listRoutineSteps(userId = 1): Promise<Array<{id: number; text: string; estimated_minutes: number; completed: boolean}>> {
  const res = await db.execute(sql`
    SELECT rs.id, rs.step_text as text, rs.estimated_minutes as estimated_minutes, rs.completed as completed
    FROM routine_steps rs
    JOIN daily_routines dr ON dr.id = rs.routine_id
    WHERE dr.user_id = ${userId}
    ORDER BY dr.sort_order, rs.sort_order
  `)
  return res.rows ?? []
}

/** List all reminders */
export async function listReminders(userId = 1): Promise<Array<{id: number; message: string; estimated_minutes?: number; remind_at: string; state: string}>> {
  const res = await db.execute(sql`
    SELECT id, message, estimated_minutes as estimated_minutes, remind_at, state
    FROM reminders
    WHERE user_id = ${userId}
    ORDER BY remind_at ASC
  `)
  return res.rows ?? []
}

/** Move a routine step's sort order */
export async function moveStep(stepId: number, newSortOrder: number, userId = 1): Promise<void> {
  await db.execute(sql`
    UPDATE routine_steps 
    SET sort_order = ${newSortOrder} 
    WHERE id = ${stepId} 
      AND (SELECT user_id FROM daily_routines WHERE id = routine_id) = ${userId}
  `)
}

/** Complete a routine step */
export async function completeStep(stepId: number, userId = 1): Promise<void> {
  await db.execute(sql`
    UPDATE routine_steps 
    SET completed = true, completed_at = NOW() 
    WHERE id = ${stepId} 
      AND (SELECT user_id FROM daily_routines WHERE id = routine_id) = ${userId}
  `)
}
