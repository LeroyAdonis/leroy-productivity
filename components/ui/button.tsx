import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--md-shape-full)] text-[var(--md-label-large)] font-medium tracking-[0.1px] transition-all duration-[var(--md-duration-short4)] ease-[var(--md-easing-standard)] focus-visible:outline-2 focus-visible:outline-[var(--md-primary)] focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-h-[40px]',
  {
    variants: {
      variant: {
        filled: 'bg-[var(--md-primary)] text-[var(--md-on-primary)] hover:shadow-[var(--md-elevation-1)]',
        tonal: 'bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)] hover:shadow-[var(--md-elevation-1)]',
        outlined: 'bg-transparent border border-[var(--md-outline)] text-[var(--md-primary)] hover:bg-[var(--md-primary)]/8',
        text: 'bg-transparent text-[var(--md-primary)] px-3 hover:bg-[var(--md-primary)]/8',
        ghost: 'hover:bg-[var(--md-on-surface)]/8 text-[var(--md-on-surface-variant)]',
        link: 'text-[var(--md-primary)] underline-offset-4 hover:underline',
        destructive: 'bg-[var(--md-error)] text-[var(--md-on-error)] hover:shadow-[var(--md-elevation-1)]',
        default: 'bg-[var(--md-primary)] text-[var(--md-on-primary)] hover:shadow-[var(--md-elevation-1)]',
      },
      size: {
        default: 'h-10 px-6',
        sm: 'h-9 rounded-[var(--md-shape-full)] px-4',
        lg: 'h-11 rounded-[var(--md-shape-full)] px-8',
        icon: 'h-10 w-10 rounded-[var(--md-shape-full)]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
export { Button, buttonVariants };