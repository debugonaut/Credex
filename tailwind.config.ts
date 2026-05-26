import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0A0A0B',
          elevated: '#111113',
          subtle: '#18181B',
        },
        accent: '#00E5A0',
        danger: '#FF4D4D',
        border: 'rgba(255, 255, 255, 0.08)',
        'text-primary': '#F2F2F0',
        'text-secondary': '#A0A0A0',
        'text-muted': '#666669',
      },
      spacing: {
        // 4px base unit — no arbitrary values after this
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '6': '24px',
        '8': '32px',
        '12': '48px',
        '16': '64px',
        '24': '96px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '12px',
      },
      fontSize: {
        xs:   ['0.75rem',   { lineHeight: '1rem' }],
        sm:   ['0.875rem',  { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.6' }],
        lg:   ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:   ['1.25rem',   { lineHeight: '1.75rem' }],
        '2xl':['1.5rem',    { lineHeight: '2rem' }],
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
