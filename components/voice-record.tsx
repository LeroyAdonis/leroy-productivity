'use client'

import { useState, useRef, useCallback } from 'react'

interface ParsedItem {
  type: 'task' | 'reminder' | 'routine_step' | 'anxiety_log'
  text: string
  minutes: number | null
  due_at: string | null
}

interface ReviewItem extends ParsedItem {
  editing: boolean
}

type Status = 'idle' | 'recording' | 'transcribing' | 'parsing' | 'review'

const STATUS_LABEL: Record<Status, string> = {
  idle: 'Hold the button and speak. Release to send.',
  recording: 'Recording… release when done.',
  transcribing: 'Transcribing…',
  parsing: 'Parsing…',
  review: 'Review what was captured, then save.',
}

const upload = async (blob: Blob, setStatus: (s: Status) => void, setItems: (items: ReviewItem[]) => void, setRawTranscript: (s: string) => void) => {
  setStatus('transcribing')
  const fd = new FormData()
  fd.append('audio', blob, 'voice.webm')
  try {
    const res = await fetch('/api/voice', { method: 'POST', body: fd })
    const data = await res.json()
    setRawTranscript(data.transcript || '')
    if (!res.ok) {
      alert(data.error || 'Voice processing failed.')
      setStatus('idle')
      return
    }
    if (data.items?.length > 0) {
      setItems(data.items.map((it: ParsedItem) => ({ ...it, editing: false })))
      setStatus('review')
    } else {
      setStatus('idle')
      alert('Nothing actionable detected. Speak a clear task or reminder.')
    }
  } catch (err) {
    alert('Voice processing failed: ' + (err as Error).message)
    setStatus('idle')
  }
}

export default function VoiceRecord() {
  const [status, setStatus] = useState<Status>('idle')
  const [items, setItems] = useState<ReviewItem[]>([])
  const [rawTranscript, setRawTranscript] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder
      chunksRef.current = []
      recorder.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data)
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        if (blob.size === 0) {
          setStatus('idle')
          return
        }
        upload(blob, setStatus, setItems, setRawTranscript)
      }
      recorder.start()
      setStatus('recording')
    } catch (err) {
      alert('Microphone not available. Check browser permissions.')
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
  }, [])

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/voice/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: items.map(({ editing, ...it }) => it) })
      })
      if (!res.ok) throw new Error(await res.text())
      setSaved(true)
      setItems([])
      setRawTranscript('')
      setStatus('idle')
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      alert('Save failed: ' + (err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const updateItem = (idx: number, patch: Partial<ReviewItem>) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))

  const removeItem = (idx: number) => setItems((prev) => prev.filter((_, i) => i !== idx))

  return (
    <section className="w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-4 py-8">
        <button
          type="button"
          onPointerDown={startRecording}
          onPointerUp={stopRecording}
          onPointerLeave={stopRecording}
          onContextMenu={(e) => e.preventDefault()}
          aria-label={status === 'recording' ? 'Release to stop' : 'Hold to record'}
          className={`select-none w-32 h-32 rounded-full text-white font-semibold text-base
            transition-transform active:scale-95 ${status === 'recording' ? 'bg-red-600' : 'bg-[#00E859]'}`}
          style={{ touchAction: 'none' }}
        >
          {status === 'recording' ? 'Release' : 'Hold'}
        </button>
        <p className="text-sm text-zinc-400">{STATUS_LABEL[status]}</p>
        {saved && <p className="text-sm text-[#00E859]">Saved ✓</p>}
      </div>

      {status === 'review' && items.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Confirm these items</h3>
          {items.map((it, i) => (
            <div key={i} className="rounded-lg border border-zinc-700 p-3 bg-zinc-900/60">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs uppercase text-zinc-500">{it.type.replace('_', ' ')}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={() => updateItem(i, { editing: !it.editing })} className="text-sm text-[#00E859]">
                    {it.editing ? 'Done' : 'Edit'}
                  </button>
                  <button type="button" onClick={() => removeItem(i)} className="text-sm text-red-400">
                    Remove
                  </button>
                </div>
              </div>
              {it.editing ? (
                <textarea
                  value={it.text}
                  onChange={(e) => updateItem(i, { text: e.target.value })}
                  rows={2}
                  className="mt-2 w-full rounded bg-zinc-800 p-2 text-sm text-zinc-100 border border-zinc-700 focus:border-[#00E859] outline-none"
                />
              ) : (
                <p className="mt-1 text-zinc-200">{it.text}</p>
              )}
              <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                {it.minutes != null && <span>{it.minutes} min</span>}
                {it.due_at && <span>@ {new Date(it.due_at).toLocaleString()}</span>}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="flex-1 rounded-lg bg-[#00E859] py-3 text-[#0A0A0B] font-semibold disabled:opacity-50 hover:bg-[#00cc4d] transition-colors"
            >
              {saving ? 'Saving…' : 'Save all'}
            </button>
            <button
              type="button"
              onClick={() => { setItems([]); setStatus('idle'); }}
              className="rounded-lg border border-zinc-700 px-4 py-3 text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </section>
  )
}