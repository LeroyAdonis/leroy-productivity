import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { id } = await request.json()
  await db.execute(sql`UPDATE reminders SET state = 'done', updated_at = datetime('now') WHERE id = ${id} AND user_id = 1`)
  return NextResponse.json({ success: true })
}