"use client";

import Link from 'next/link';
import { useEffect } from "react";

export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)]">
      {/* M3 Top App Bar */}
      <header className="md-top-app-bar px-4">
        <div className="flex-1">
          <h1 className="text-[var(--md-headline-medium)] font-semibold text-[var(--md-on-surface)]">
            Flow
          </h1>
          <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
            Personal productivity — action-first
          </p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Quick Actions Section */}
        <section aria-label="Quick actions">
          <h2 className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface-variant)] mb-4">
            What&apos;s next
          </h2>
          <div className="space-y-3">
            <Link href="/routine" className="block">
              <div className="md-card md-card-elevated p-4 min-tap-target">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--md-shape-medium)] bg-[var(--md-secondary-container)] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--md-on-secondary-container)]">
                      <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface)]">
                      Daily Routine
                    </p>
                    <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
                      Start your checklist — 3 steps, ~8 min
                    </p>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--md-on-surface-variant)]">
                    <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/reminders" className="block">
              <div className="md-card md-card-elevated p-4 min-tap-target">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--md-shape-medium)] bg-[var(--md-primary-container)] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--md-on-primary-container)]">
                      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface)]">
                      Reminders
                    </p>
                    <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
                      Due, upcoming, and snoozed items
                    </p>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--md-on-surface-variant)]">
                    <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </Link>

            <Link href="/calm" className="block">
              <div className="md-card md-card-elevated p-4 min-tap-target">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[var(--md-shape-medium)] bg-[var(--md-tertiary-container)] flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--md-on-tertiary-container)]">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface)]">
                      Calm Moment
                    </p>
                    <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
                      Breathing, grounding, anxiety log
                    </p>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--md-on-surface-variant)]">
                    <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Navigation Grid */}
        <section aria-label="App sections">
          <h2 className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface-variant)] mb-4">
            Sections
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { href: '/routine', label: 'Routine', sub: 'Daily steps', color: 'bg-[var(--md-secondary-container)]' },
              { href: '/tasks', label: 'Tasks', sub: 'Now / Later / Done', color: 'bg-[var(--md-primary-container)]' },
              { href: '/reminders', label: 'Reminders', sub: 'Due / Upcoming', color: 'bg-[var(--md-tertiary-container)]' },
              { href: '/calm', label: 'Calm', sub: 'Breathing / Grounding', color: 'bg-[var(--md-surface-container-high)]' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="block">
                <div className="md-card md-card-outlined p-4 min-tap-target text-center">
                  <div className={`w-10 h-10 rounded-[var(--md-shape-full)] ${item.color} mx-auto mb-2 flex items-center justify-center`}>
                    <div className="w-2 h-2 rounded-full bg-[var(--md-on-surface)]" />
                  </div>
                  <p className="text-[var(--md-title-small)] font-medium text-[var(--md-on-surface)]">
                    {item.label}
                  </p>
                  <p className="text-[var(--md-body-small)] text-[var(--md-on-surface-variant)]">
                    {item.sub}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
