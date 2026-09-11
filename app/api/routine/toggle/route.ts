import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { stepId } = await request.json()
  const res = await db.execute(sql`SELECT completed FROM routine_steps WHERE id = ${stepId}`)
  const current = Boolean(res.rows?.[0]?.completed)
  await db.execute(sql`UPDATE routine_steps SET completed = ${!current}, completed_at = ${!current ? sql`datetime('now')` : sql`NULL`} WHERE id = ${stepId}`)
  return NextResponse.json({ success: true, completed: !current })
}