import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const res = await db.execute(
      `SELECT rs.id, rs.step_text as text, rs.estimated_minutes, rs.completed, rs.sort_order, dr.name as routine
       FROM routine_steps rs JOIN daily_routines dr ON dr.id = rs.routine_id
       WHERE dr.user_id = 1 ORDER BY dr.sort_order, rs.sort_order`
    )
    return NextResponse.json(res.rows?.map(r => ({
      id: r.id,
      text: r.text,
      estimated_minutes: r.estimated_minutes,
      completed: Boolean(r.completed),
      routine: r.routine
    })) ?? [])
  } catch (error) {
    console.error('[steps] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { routine_id, step_text, estimated_minutes = 2 } = await request.json()
    const res = await db.execute(
      `INSERT INTO routine_steps (routine_id, step_text, estimated_minutes, sort_order) VALUES (?, ?, ?, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM routine_steps WHERE routine_id = ?)) RETURNING id, step_text, estimated_minutes, completed, sort_order`,
      [routine_id, step_text, estimated_minutes, routine_id]
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[steps] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
