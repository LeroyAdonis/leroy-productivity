import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function GET() {
  const res = await db.execute(sql`
    SELECT dr.id, dr.name, dr.description, dr.is_active, dr.sort_order,
      (SELECT COUNT(*) FROM routine_steps rs WHERE rs.routine_id = dr.id AND rs.completed = true) as completed,
      (SELECT COUNT(*) FROM routine_steps rs WHERE rs.routine_id = dr.id) as total
    FROM daily_routines dr WHERE dr.user_id = 1 ORDER BY dr.sort_order
  `)
  return NextResponse.json(res.rows ?? [])
}

export async function POST(request: Request) {
  const { name, description } = await request.json()
  const res = await db.execute(sql`
    INSERT INTO daily_routines (user_id, name, description, sort_order)
    VALUES (1, ${name}, ${description ?? null}, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM daily_routines WHERE user_id = 1))
    RETURNING id, name, description, is_active, sort_order
  `)
  return NextResponse.json(res.rows?.[0] ?? null)
}
