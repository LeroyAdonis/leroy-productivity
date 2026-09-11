import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function GET() {
  const res = await db.execute(sql`SELECT id, message, action, remind_at, state, snooze_until FROM reminders WHERE user_id = 1 ORDER BY remind_at ASC`)
  return NextResponse.json(res.rows ?? [])
}

export async function POST(request: Request) {
  const { message, action, remind_at } = await request.json()
  const res = await db.execute(sql`INSERT INTO reminders (user_id, message, action, remind_at, state) VALUES (1, ${message}, ${action ?? null}, ${remind_at}, 'pending') RETURNING id, message, action, remind_at, state`)
  return NextResponse.json(res.rows?.[0] ?? null)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { state } = await request.json()
  const res = await db.execute(sql`UPDATE reminders SET state = ${state}, updated_at = datetime('now') WHERE id = ${Number(id)} AND user_id = 1 RETURNING id, message, state`)
  return NextResponse.json(res.rows?.[0] ?? null)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.execute(sql`DELETE FROM reminders WHERE id = ${Number(id)} AND user_id = 1`)
  return NextResponse.json({ success: true })
}
