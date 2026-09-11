import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { completed } = await request.json()
    const res = await db.execute(
      sql`UPDATE routine_steps SET completed = ${completed ? 'true' : 'false'} WHERE id = ${Number(id)} RETURNING id, step_text, completed, sort_order`
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[steps/[id]] PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
