import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const res = await db.execute(
      `SELECT dr.id, dr.name, dr.description, dr.is_active, dr.sort_order,
              (SELECT COUNT(*) FROM routine_steps rs WHERE rs.routine_id = dr.id AND rs.completed = true) as completed,
              (SELECT COUNT(*) FROM routine_steps rs WHERE rs.routine_id = dr.id) as total
       FROM daily_routines dr WHERE dr.user_id = 1 ORDER BY dr.sort_order`
    )
    return NextResponse.json(res.rows ?? [])
  } catch (error) {
    console.error('[routine] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()
    const res = await db.execute(
      `INSERT INTO daily_routines (user_id, name, description, sort_order) VALUES (1, ?, ?, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM daily_routines WHERE user_id = 1)) RETURNING id, name, description, is_active, sort_order`,
      [name, description ?? null]
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[routine] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
