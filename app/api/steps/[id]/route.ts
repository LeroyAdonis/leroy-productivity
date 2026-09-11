import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { completed } = await request.json()
  const res = await db.execute(sql`UPDATE routine_steps SET completed = ${completed ? 'true' : 'false'} WHERE id = ${Number(id)} RETURNING id, step_text, completed, sort_order`)
  return NextResponse.json(res.rows?.[0] ?? null)
}
