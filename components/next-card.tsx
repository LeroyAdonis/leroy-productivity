'use client'

import { useState } from 'react'
import { type NextAction } from '@/lib/next-action'

interface Props {
  item: NextAction
  onComplete: () => void
}

export default function NextCard({ item, onComplete }: Props) {
  const [completed, setCompleted] = useState(false)
  const [shown, setShown] = useState(false)

  const handleComplete = async () => {
    setCompleted(true)
    onComplete()

    setTimeout(() => {
      setShown(true)
    }, 2000)
  }

  if (shown) return null

  return (
    <div
      className="group bg-[#0A0A0B] border border-zinc-800 rounded-2xl p-6 max-w-sm mx-auto transition-all duration-500 ease-out [&:focus-visible]:outline-none [&:focus-visible]:outline-2 [&:focus-visible]:outline-[#00E859]"
    >
      <h2 className="text-3xl font-bold text-[#00E859] mb-2 tracking-tight">
        {item.text}
      </h2>

      <p className="text-zinc-400 text-base mb-6 leading-relaxed">
        {item.minutes} min
      </p>

      <button
        onClick={handleComplete}
        className="w-full bg-[#00E859] text-[#0A0A0B] font-semibold py-3 rounded-xl text-lg hover:bg-[#00cc4d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E859] focus-visible:ring-offset-2"
        disabled={completed}
      >
        {completed ? 'Done' : 'Complete'}
      </button>
    </div>
  )
}