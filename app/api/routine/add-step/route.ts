import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { routineId, text, minutes } = await request.json()
  const res = await db.execute(sql`
    INSERT INTO routine_steps (routine_id, step_text, estimated_minutes, sort_order)
    VALUES (${routineId}, ${text}, ${minutes}, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM routine_steps WHERE routine_id = ${routineId}))
    RETURNING id, step_text, estimated_minutes, completed, sort_order
  `)
  return NextResponse.json(res.rows?.[0] ?? null)
}