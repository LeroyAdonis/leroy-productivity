/* PREMIUM — Floating pill nav — brand gold (#C8A951) + green (#00E859) */
'use client';
import Link from 'next/link';

const NAV_ITEMS = [
  { href: '/', label: 'Flow', sub: 'Home' },
  { href: '/routine', label: 'Routine', sub: 'Steps' },
  { href: '/calm', label: 'Calm', sub: 'Reset' },
  { href: '/reminders', label: 'Reminders', sub: 'Due' },
  { href: '/tasks', label: 'Tasks', sub: 'Now / Later / Done' },
];

export default function PremiumNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md"
    >
      <div className="glass glass-elevation-3 rounded-full px-3 py-2 flex items-center justify-between shadow-glass backdrop-blur-xl border border-white/[0.06]">
        <Link href="/" className="flex items-center gap-1.5 px-2 group">
          <span className="w-2 h-2 rounded-full bg-[#C8A951] shadow-glow-gold" aria-hidden />
          <span className="text-xs font-bold tracking-tight text-[#C8A951]">Flow</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.filter(i => i.href !== '/').map(i => (
            <Link
              key={i.href}
              href={i.href}
              className="text-xs font-medium px-2.5 py-1.5 rounded-full text-zinc-300 hover:text-[#C8A951] hover:bg-white/[0.05] transition-colors"
              aria-label={i.sub}
            >
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
