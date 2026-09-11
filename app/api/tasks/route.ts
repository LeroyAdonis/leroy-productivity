import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function GET() {
  const res = await db.execute(sql`SELECT id, title, estimated_minutes, state, project_tag, sort_order, created_at FROM tasks WHERE user_id = 1 ORDER BY sort_order, id`)
  return NextResponse.json(res.rows ?? [])
}

export async function POST(request: Request) {
  const { title, estimated_minutes = 2, state = 'now', project_tag } = await request.json()
  const res = await db.execute(sql`
    INSERT INTO tasks (user_id, title, estimated_minutes, state, project_tag, sort_order)
    VALUES (1, ${title}, ${estimated_minutes}, ${state}, ${project_tag ?? null}, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tasks WHERE user_id = 1))
  `)
  const row = res.rows?.[0]
  if (!row) throw new Error('Failed to create task')
  return NextResponse.json({ id: Number(row.id), title, estimated_minutes, state, project_tag })
}