"use client";

import Link from 'next/link';
import { useEffect } from "react";
import { initGSAP, animateGlassEntrance } from "@/lib/gsap-init";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  useEffect(() => {
    const ctx = initGSAP();
    animateGlassEntrance(".glass-card");
    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-foreground)] px-5 py-10 max-w-2xl mx-auto font-sans">
      <header className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight text-[var(--color-primary)] mb-2">Flow</h1>
        <p className="text-[var(--color-muted-foreground)] text-sm">Personal productivity — action-first, visible progress.</p>
      </header>

      <section aria-label="Quick start" className="mb-10">
        <h2 className="text-xs font-medium uppercase tracking-widest text-[var(--color-muted-foreground)] mb-3">What&apos;s next</h2>
        <div className="glass glass-elevation-3 glass-transition rounded-xl p-4">
          <p className="text-lg font-semibold text-[var(--color-foreground)] mb-1">Open Routine</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">Start your daily checklist — 3 steps, ~8 min.</p>
          <Link href="/routine" className="inline-block mt-3 text-sm font-medium text-[var(--color-primary)] hover:underline">Go →</Link>
        </div>

        <div className="glass glass-elevation-3 glass-transition rounded-xl p-4 mt-4">
          <p className="text-lg font-semibold text-[var(--color-foreground)] mb-1">View Reminders</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">Due, upcoming, and snoozed items</p>
          <Link href="/reminders" className="inline-block mt-3 text-sm font-medium text-[var(--color-accent)] hover:underline">Go →</Link>
        </div>

        <div className="glass glass-elevation-3 glass-transition rounded-xl p-4 mt-4">
          <p className="text-lg font-semibold text-[var(--color-foreground)] mb-1">Calm moment</p>
          <p className="text-sm text-[var(--color-muted-foreground)]">Breathing, grounding, anxiety log — take a moment.</p>
          <Link href="/calm" className="inline-block mt-3 text-sm font-medium text-[var(--color-primary)] hover:underline">Go →</Link>
        </div>
      </section>

      <nav aria-label="App sections" className="grid grid-cols-2 gap-3 mb-10">
        {[
          { href: '/routine', label: 'Routine', sub: 'Daily steps' },
          { href: '/reminders', label: 'Reminders', sub: 'Due / upcoming / snoozed' },
          { href: '/calm', label: 'Calm', sub: 'Breathing / grounding' },
          { href: '/api/tasks', label: 'Tasks', sub: 'Now / later / done' },
        ].map(s => (
          <Link key={s.href} href={s.href} className="glass glass-elevation-2 glass-transition rounded-lg p-3 hover:border-[rgba(255,255,255,0.3)]">
            <div className="text-base font-semibold text-[var(--color-foreground)]">{s.label}</div>
            <div className="text-xs text-[var(--color-muted-foreground)]">{s.sub}</div>
          </Link>
        ))}
      </nav>

      <footer className="text-xs text-[var(--color-muted-foreground)]">
        Flow — ADHD-optimized · Vercel · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
