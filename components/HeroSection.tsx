/* HeroSection — premium hero with gradient blobs + glass statement card */
'use client';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section aria-label="Hero" className="relative py-16 md:py-24 px-4 overflow-hidden">
      {/* Gradient blur blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 blob-gold blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 blob-green blur-3xl pointer-events-none" aria-hidden />

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass glass-elevation-1 text-xs font-medium text-[#C8A951] tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8A951]" aria-hidden />
            Personal Productivity
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-[var(--color-primary)]">
            Flow
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted-foreground)] max-w-xl mx-auto">
            Action-first, visible progress. Built for focus.
          </p>
        </div>

        <div className="glass glass-elevation-4 rounded-2xl p-6 md:p-8 max-w-xl mx-auto border border-[var(--glass-border)]">
          <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
            Your day, organized. Your mind, at ease.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#C8A951]">5</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00E859]">ADHD</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Optimized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[var(--color-foreground)]">24/7</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">Available</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/routine"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-[#C8A951] text-[var(--color-on-primary)] font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Open Routine
            </Link>
            <Link
              href="/calm"
              className="inline-flex items-center justify-center px-5 py-2.5 glass glass-elevation-2 rounded-lg text-[var(--color-foreground)] hover:border-white/20 transition-colors"
            >
              Take a breath
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
