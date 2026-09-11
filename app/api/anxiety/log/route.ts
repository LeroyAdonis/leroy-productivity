import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { severity, note } = await request.json()
    const res = await db.execute(sql`
      INSERT INTO anxiety_logs (user_id, severity, trigger)
      VALUES (1, ${Number(severity)}, ${note ?? null})
      RETURNING id, severity, trigger
    `)
    return NextResponse.json({ saved: true, id: res.rows?.[0]?.id })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}