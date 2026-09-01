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
        // ── Saffron, Green & Indigo Undertone ────────────────────────────────
        'prussian-blue':   '#14213D', // indigo undertone
        'midnight-blue':   '#0C1626', // deep indigo
        'vibrant-saffron': '#E8720C',
        'deep-saffron':    '#B85A08',
        'light-saffron':   '#FBE4C8',
        'crisp-green':     '#146B3A',

        // Surfaces
        'background':      '#FAF6EF',
        'surface':         '#FFFDF8',
        'surface-raised':  '#F2EBDB',

        // Text on colored surfaces
        'on-surface':         '#1C1B18',
        'on-surface-muted':   '#6B6558',
        'on-primary':         '#FFFFFF',
        'on-primary-muted':   '#9AA6C2',

        // Borders
        'border-light':    '#E7DFCB',
      },
      fontFamily: {
        sans:    ['Sora', 'system-ui', 'sans-serif'],
        display: ['Sora', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':  'fadeIn 0.25s ease-out',
        'shimmer':  'shimmer 1.4s ease-in-out infinite',
        'eq1': 'eq1 1.0s ease-in-out infinite',
        'eq2': 'eq2 1.1s ease-in-out infinite',
        'eq3': 'eq3 0.9s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        eq1: { '0%,100%': { height: '4px' },  '50%': { height: '16px' } },
        eq2: { '0%,100%': { height: '10px' }, '50%': { height: '4px'  } },
        eq3: { '0%,100%': { height: '6px' },  '50%': { height: '14px' } },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}

export default config
