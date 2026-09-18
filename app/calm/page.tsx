import BreathingTimer from '@/components/breathing-timer';
import Grounding from '@/components/grounding';
import AnxietyLog from '@/components/anxiety-log';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function CalmPage() {
  return (
    <div className="min-h-screen bg-[var(--md-surface)] text-[var(--md-on-surface)]">
      {/* M3 Top App Bar */}
      <header className="md-top-app-bar px-4">
        <div className="flex-1">
          <h1 className="text-[var(--md-headline-medium)] font-semibold text-[var(--md-on-surface)]">
            Calm
          </h1>
          <p className="text-[var(--md-body-medium)] text-[var(--md-on-surface-variant)]">
            Take a moment. You are safe here.
          </p>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* M3 Accent Card */}
        <Card variant="accent">
          <CardHeader>
            <CardTitle className="text-[var(--md-title-large)]">I am overwhelmed</CardTitle>
            <CardDescription>
              You do not have to do everything at once. Start with one of these:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 list-decimal list-inside text-[var(--md-body-medium)] text-[var(--md-on-surface)]/80">
              <li>
                <span className="font-medium text-[var(--md-primary)]">Breathe</span> — use the timer
                below to slow down.
              </li>
              <li>
                <span className="font-medium text-[var(--md-primary)]">Ground yourself</span> — the
                5-4-3-2-1 exercise brings you back to the present.
              </li>
              <li>
                <span className="font-medium text-[var(--md-primary)]">Log it</span> — writing down how
                you feel takes the weight off.
              </li>
            </ol>
          </CardContent>
          <CardFooter>
            <p className="text-[var(--md-body-small)] text-[var(--md-on-surface-variant)]">
              Press Escape or tap outside to dismiss. No data is stored without your action.
            </p>
          </CardFooter>
        </Card>

        {/* Breathing Timer */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface-variant)]">
              Breathing Timer
            </CardTitle>
            <CardDescription>
              Follow the circle. Inhale as it fills, exhale as it empties.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BreathingTimer />
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-[var(--md-body-small)] text-[var(--md-on-surface-variant)]">
              30s, 60s, or 180s sessions. No minimum commitment.
            </p>
          </CardFooter>
        </Card>

        {/* 5-4-3-2-1 Grounding */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface-variant)]">
              5-4-3-2-1 Grounding
            </CardTitle>
            <CardDescription>
              Name things around you to anchor yourself in the present moment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Grounding />
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-[var(--md-body-small)] text-[var(--md-on-surface-variant)]">
              Five senses, five steps back to center.
            </p>
          </CardFooter>
        </Card>

        {/* Log How You Feel */}
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-[var(--md-title-medium)] font-medium text-[var(--md-on-surface-variant)]">
              Log How You Feel
            </CardTitle>
            <CardDescription>
              Check in with yourself. No judgment, just awareness.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnxietyLog />
          </CardContent>
          <CardFooter className="pt-0">
            <p className="text-[var(--md-body-small)] text-[var(--md-on-surface-variant)]">
              Severity 1–10 with optional notes. Local only.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
