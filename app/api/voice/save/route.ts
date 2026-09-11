import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { items } = await request.json()
    const results = []
    for (const item of (items || [])) {
      if (item.type === 'task') {
        const res = await db.execute(sql`
          INSERT INTO tasks (user_id, title, estimated_minutes, state, sort_order)
          VALUES (1, ${item.text || 'Voice task'}, ${item.minutes ?? 2}, 'now', (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tasks WHERE user_id = 1))
          RETURNING id, title
        `)
        results.push({ saved: true, type: 'task', id: res.rows?.[0]?.id })
      } else if (item.type === 'reminder') {
        const res = await db.execute(sql`
          INSERT INTO reminders (user_id, message, remind_at, state)
          VALUES (1, ${item.text || 'Voice reminder'}, ${item.due_at || 'NOW()'}, 'pending')
          RETURNING id, message
        `)
        results.push({ saved: true, type: 'reminder', id: res.rows?.[0]?.id })
      }
    }
    return NextResponse.json({ saved: true, results })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}