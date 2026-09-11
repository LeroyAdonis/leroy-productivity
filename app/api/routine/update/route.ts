import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { stepId, text, minutes } = await request.json()
  const updates = []
  if (text !== undefined) updates.push(sql`step_text = ${text}`)
  if (minutes !== undefined) updates.push(sql`estimated_minutes = ${minutes}`)
  if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
  await db.execute(sql`UPDATE routine_steps SET ${sql.join(updates, sql`, `)} WHERE id = ${stepId}`)
  return NextResponse.json({ success: true })
}