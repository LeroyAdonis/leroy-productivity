import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, description, is_active } = await request.json()
  const res = await db.execute(sql`
    UPDATE daily_routines
    SET name = COALESCE(${name ?? null}, name), description = COALESCE(${description ?? null}, description), is_active = COALESCE(${is_active ?? null}, is_active)
    WHERE id = ${Number(id)} AND user_id = 1
    RETURNING id, name, description, is_active, sort_order
  `)
  return NextResponse.json(res.rows?.[0] ?? null)
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.execute(sql`DELETE FROM routine_steps WHERE routine_id = ${Number(id)}`)
  await db.execute(sql`DELETE FROM daily_routines WHERE id = ${Number(id)} AND user_id = 1`)
  return NextResponse.json({ success: true })
}
