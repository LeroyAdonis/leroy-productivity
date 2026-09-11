import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { name, description, is_active } = await request.json()
    const res = await db.execute(
      `UPDATE daily_routines SET name = COALESCE(?, name), description = COALESCE(?, description), is_active = COALESCE(?, is_active) WHERE id = ? AND user_id = 1 RETURNING id, name, description, is_active, sort_order`,
      [name ?? null, description ?? null, is_active ?? null, Number(id)]
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[routine/[id]] PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.execute(`DELETE FROM routine_steps WHERE routine_id = ?`, [Number(id)])
    await db.execute(`DELETE FROM daily_routines WHERE id = ? AND user_id = 1`, [Number(id)])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[routine/[id]] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
