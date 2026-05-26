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
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
          subtle: '#F5F5F5',
        },
        accent: '#000000',
        danger: '#000000',
        border: {
          DEFAULT: '#000000',
          light: '#E5E5E5',
        },
        'text-primary': '#000000',
        'text-secondary': '#525252',
        'text-muted': '#737373',
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
        sm: '0px',
        DEFAULT: '0px',
        lg: '0px',
      },
      fontSize: {
        xs:   ['0.75rem',   { lineHeight: '1.2' }],
        sm:   ['0.875rem',  { lineHeight: '1.4' }],
        base: ['1rem',      { lineHeight: '1.625' }],
        lg:   ['1.125rem',  { lineHeight: '1.75' }],
        xl:   ['1.25rem',   { lineHeight: '1.75' }],
        '2xl':['1.5rem',    { lineHeight: '2rem' }],
        '3xl':['2rem',      { lineHeight: '1' }],
        '4xl':['2.5rem',    { lineHeight: '1' }],
        '5xl':['3.5rem',    { lineHeight: '1' }],
        '6xl':['4.5rem',    { lineHeight: '1' }],
        '7xl':['6rem',      { lineHeight: '1' }],
        '8xl':['8rem',      { lineHeight: '1' }],
        '9xl':['10rem',     { lineHeight: '1' }],
      },
      fontFamily: {
        sans: ['var(--font-serif-body)', 'Georgia', 'serif'],
        serif: ['var(--font-serif-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 0.1s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
