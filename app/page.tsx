import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-zinc-100 px-5 py-10 max-w-2xl mx-auto font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-semibold tracking-tight text-[#00E859] mb-2">Flow</h1>
        <p className="text-zinc-400 text-sm">Personal productivity — action-first, visible progress.</p>
      </header>

      <section aria-label="Quick start" className="mb-10">
        <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">What&apos;s next</h2>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-lg font-medium text-zinc-100 mb-1">Open Routine</p>
          <p className="text-sm text-zinc-400">Start your daily checklist — 3 steps, ~8 min.</p>
          <Link href="/routine" className="inline-block mt-3 text-sm font-medium text-[#00E859] hover:underline">Go →</Link>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 mt-4">
          <p className="text-lg font-medium text-zinc-100 mb-1">View Reminders</p>
          <p className="text-sm text-zinc-400">Due, upcoming, and snoozed items</p>
          <Link href="/reminders" className="inline-block mt-3 text-sm font-medium text-[#C8A951] hover:underline">Go →</Link>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 mt-4">
          <p className="text-lg font-medium text-zinc-100 mb-1">Calm moment</p>
          <p className="text-sm text-zinc-400">Breathing, grounding, anxiety log — take a moment.</p>
          <Link href="/calm" className="inline-block mt-3 text-sm font-medium text-[#00E859] hover:underline">Go →</Link>
        </div>
      </section>

      <nav aria-label="App sections" className="grid grid-cols-2 gap-3 mb-10">
        {[
          { href: '/routine', label: 'Routine', sub: 'Daily steps' },
          { href: '/reminders', label: 'Reminders', sub: 'Due / upcoming / snoozed' },
          { href: '/calm', label: 'Calm', sub: 'Breathing / grounding' },
          { href: '/api/tasks', label: 'Tasks', sub: 'Now / later / done' },
        ].map(s => (
          <Link key={s.href} href={s.href} className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 hover:border-zinc-600 transition-colors">
            <div className="text-base font-medium text-zinc-100">{s.label}</div>
            <div className="text-xs text-zinc-500">{s.sub}</div>
          </Link>
        ))}
      </nav>

      <footer className="text-xs text-zinc-600">
        Flow — ADHD-optimized · Vercel · {new Date().getFullYear()}
      </footer>
    </div>
  );
}