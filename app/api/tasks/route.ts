import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const res = await db.execute(
      `SELECT id, title, estimated_minutes, state, project_tag, sort_order, created_at FROM tasks WHERE user_id = 1 ORDER BY sort_order, id`
    )
    return NextResponse.json(res.rows ?? [])
  } catch (error) {
    console.error('[tasks] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { title, estimated_minutes = 2, state = 'now', project_tag } = await request.json()
    const res = await db.execute(
      `INSERT INTO tasks (user_id, title, estimated_minutes, state, project_tag, sort_order) VALUES (1, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM tasks WHERE user_id = 1))`,
      [title, estimated_minutes, state, project_tag ?? null]
    )
    const row = res.rows?.[0]
    if (!row) throw new Error('Failed to create task')
    return NextResponse.json({ id: Number(row_id), title, estimated_minutes, state, project_tag })
  } catch (error) {
    console.error('[tasks] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { state } = await request.json()
    const res = await db.execute(
      `UPDATE tasks SET state = ?, updated_at = datetime('now') WHERE id = ? AND user_id = 1 RETURNING id, title, estimated_minutes, state, project_tag, sort_order, created_at`,
      [state, Number(id)]
    )
    return NextResponse.json(res.rows?.[0] ?? null)
  } catch (error) {
    console.error('[tasks] PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.execute(`DELETE FROM tasks WHERE id = ? AND user_id = 1`, [Number(id)])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[tasks] DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
