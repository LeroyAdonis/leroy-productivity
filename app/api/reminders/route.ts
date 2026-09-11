import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const res = await db.execute(
      `SELECT id, message, action, remind_at, state, snooze_until FROM reminders WHERE user_id = 1 ORDER BY remind_at ASC`
    )
    return NextResponse.json(res.rows ?? [])
  } catch (error) {
    console.error('[reminders] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { message, action, remind_at } = await request.json()
    const res = await db.execute(
      `INSERT INTO reminders (user_id, message, action, remind_at, state) VALUES (1, ?, ?, ?, 'pending') RETURNING id, message, action, remind_at, state`,
      [message, action ?? null, remind_at]
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[reminders] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { state } = await request.json()
    const res = await db.execute(
      `UPDATE reminders SET state = ?, updated_at = datetime('now') WHERE id = ? AND user_id = 1 RETURNING id, message, state`,
      [state, Number(id)]
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[reminders] PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.execute(`DELETE FROM reminders WHERE id = ? AND user_id = 1`, [Number(id)])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[reminders] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
