import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const progressVariants = cva('h-2 w-full overflow-hidden rounded-full bg-border', {
  variants: {
    variant: {
      default: '[&>div]:bg-[#00E859]',
      secondary: '[&>div]:bg-zinc-600',
      destructive: '[&>div]:bg-red-500',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value?: number;
  max?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, ((value ?? 0) / max) * 100));
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(progressVariants({ variant, className }))}
        {...props}
      >
        <div
          className="h-full w-full flex-1 transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress, progressVariants };
