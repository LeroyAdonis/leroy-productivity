import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function GET() {
  const res = await db.execute(sql`
    SELECT rs.id, rs.step_text as text, rs.estimated_minutes, rs.completed, rs.sort_order, dr.name as routine
    FROM routine_steps rs JOIN daily_routines dr ON dr.id = rs.routine_id
    WHERE dr.user_id = 1 ORDER BY dr.sort_order, rs.sort_order
  `)
  return NextResponse.json((res.rows ?? []).map(r => ({
    id: r.id, text: r.text, estimated_minutes: r.estimated_minutes,
    completed: Boolean(r.completed), routine: r.routine
  })))
}

export async function POST(request: Request) {
  const { routine_id, step_text, estimated_minutes = 2 } = await request.json()
  const res = await db.execute(sql`
    INSERT INTO routine_steps (routine_id, step_text, estimated_minutes, sort_order)
    VALUES (${routine_id}, ${step_text}, ${estimated_minutes}, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM routine_steps WHERE routine_id = ${routine_id}))
    RETURNING id, step_text, estimated_minutes, completed, sort_order
  `)
  return NextResponse.json(res.rows?.[0] ?? null)
}
