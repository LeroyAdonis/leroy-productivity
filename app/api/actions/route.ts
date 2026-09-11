import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { type, id, completed } = body

    switch (type) {
      case 'complete_task':
        await db.execute(
          sql`UPDATE tasks SET state = 'done' WHERE id = ${id}`,
        )
        break
      case 'complete_routine_step':
        await db.execute(
          sql`UPDATE routine_steps SET completed = true WHERE id = ${id}`,
        )
        break
      case 'dismiss_reminder':
        await db.execute(
          sql`UPDATE reminders SET state = 'done' WHERE id = ${id}`,
        )
        break
      case 'complete_anxiety_log':
        // No-op: anxiety logs are read-only once logged
        break
      default:
        return NextResponse.json({ error: 'Unknown action type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[actions] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
