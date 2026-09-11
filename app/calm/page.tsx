import BreathingTimer from '@/components/breathing-timer';
import Grounding from '@/components/grounding';
import AnxietyLog from '@/components/anxiety-log';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function CalmPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground px-4 py-8 max-w-xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-primary">Calm</h1>
        <p className="text-muted-foreground text-sm">Take a moment. You are safe here.</p>
      </header>

      <Card variant="accent" className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">I am overwhelmed</CardTitle>
          <CardDescription>
            You do not have to do everything at once. Start with one of these:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal list-inside text-sm text-foreground/80">
            <li>
              <span className="font-medium text-primary">Breathe</span> — use the timer
              below to slow down.
            </li>
            <li>
              <span className="font-medium text-primary">Ground yourself</span> — the
              5-4-3-2-1 exercise brings you back to the present.
            </li>
            <li>
              <span className="font-medium text-primary">Log it</span> — writing down how
              you feel takes the weight off.
            </li>
          </ol>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Press Escape or tap outside to dismiss. No data is stored without your action.
          </p>
        </CardFooter>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              30s, 60s, or 180s sessions. No minimum commitment.
            </p>
          </CardFooter>
        </Card>

        <Separator className="bg-border/60" />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              Five senses, five steps back to center.
            </p>
          </CardFooter>
        </Card>

        <Separator className="bg-border/60" />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
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
            <p className="text-xs text-muted-foreground">
              Severity 1–10 with optional notes. Local only.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
