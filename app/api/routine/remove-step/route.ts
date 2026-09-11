import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const { stepId } = await request.json()
  await db.execute(sql`DELETE FROM routine_steps WHERE id = ${stepId}`)
  return NextResponse.json({ success: true })
}