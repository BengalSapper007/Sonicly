import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F6F1E4',
        paper: '#FCFAF3',
        sand: '#E1D6BE',
        ink: '#211E1A',
        'ink-muted': '#6B6252',

        indigo: '#1B2447',
        'indigo-deep': '#12192F',
        'on-indigo': '#FFFFFF',
        'on-indigo-muted': '#A6ACC4',

        saffron: '#E2720A',
        'saffron-deep': '#B85B08',
        'saffron-tint': '#FBE3C6',

        emerald: '#0F6B45',
        'emerald-deep': '#0B5236',
        'emerald-tint': '#DCEBE2',

        // Aliases so pages not yet rewritten inherit the fresh palette automatically
        'prussian-blue': '#1B2447',
        'midnight-blue': '#12192F',
        'vibrant-saffron': '#E2720A',
        'deep-saffron': '#B85B08',
        'light-saffron': '#FBE3C6',
        'crisp-green': '#0F6B45',
        background: '#F6F1E4',
        surface: '#FCFAF3',
        'surface-raised': '#EDE4CC',
        'on-surface': '#211E1A',
        'on-surface-muted': '#6B6252',
        'on-primary': '#FFFFFF',
        'on-primary-muted': '#A6ACC4',
        'border-light': '#E1D6BE',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Instrument Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        shimmer: 'shimmer 1.4s ease-in-out infinite',
        eq1: 'eq1 1.0s ease-in-out infinite',
        eq2: 'eq2 1.1s ease-in-out infinite',
        eq3: 'eq3 0.9s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        eq1: { '0%,100%': { height: '4px' }, '50%': { height: '16px' } },
        eq2: { '0%,100%': { height: '10px' }, '50%': { height: '4px' } },
        eq3: { '0%,100%': { height: '6px' }, '50%': { height: '14px' } },
      },
      spacing: { '18': '4.5rem', '22': '5.5rem' },
      screens: { xs: '480px' },
    },
  },
  plugins: [],
}

export default config
