import type { Config } from '@tailwindcss/node';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        foreground: 'var(--color-foreground)',
        surface: 'var(--color-surface)',
        'surface-elevated': 'var(--color-surface-elevated)',
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        secondary: 'var(--color-secondary)',
        'on-secondary': 'var(--color-on-secondary)',
        accent: 'var(--color-accent)',
        'on-accent': 'var(--color-on-accent)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        border: 'var(--color-border)',
        destructive: 'var(--color-destructive)',
        'on-destructive': 'var(--color-on-destructive)',
        ring: 'var(--color-ring)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glass: 'var(--shadow-glass)',
      },
      backdropBlur: {
        DEFAULT: 'var(--glass-blur)',
      },
    },
  },
  plugins: [],
};

export default config;
