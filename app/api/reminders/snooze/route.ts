import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { id, minutes } = await request.json()
  const newUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString()
  await db.execute(sql`UPDATE reminders SET state = 'snoozed', snooze_until = ${newUntil}, updated_at = datetime('now') WHERE id = ${id} AND user_id = 1`)
  return NextResponse.json({ success: true, snooze_until: newUntil })
}