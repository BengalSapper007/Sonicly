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
        // Core dark palette
        void:    '#080A0E',       // Deepest background
        abyss:   '#0D1117',       // Main surface
        surface: '#12181F',       // Card / panel backgrounds
        elevated:'#1A2232',       // Elevated cards
        rim:     '#1F2D42',       // Borders, dividers
        muted:   '#2A3A52',       // Muted borders
        
        // Text hierarchy
        ink:     {
          DEFAULT: '#F0F4F8',     // Primary text
          dim:     '#8A9BB0',     // Secondary text
          ghost:   '#4A5D72',     // Disabled / placeholder
        },
        
        // Brand
        sonic: {
          DEFAULT: '#4F9CF9',     // Primary brand blue
          light:   '#7BB8FF',
          dark:    '#2B6FCC',
          glow:    'rgba(79,156,249,0.2)',
        },
        
        // Accent
        neon: {
          purple: '#9B7FFF',
          pink:   '#FF6B9D',
          cyan:   '#4BDFDB',
          green:  '#52E5B0',
          orange: '#FF9055',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-sonic': 'linear-gradient(135deg, #4F9CF9 0%, #9B7FFF 100%)',
        'gradient-dark':  'linear-gradient(180deg, #12181F 0%, #080A0E 100%)',
        'gradient-card':  'linear-gradient(145deg, rgba(26,34,50,0.8) 0%, rgba(18,24,31,0.4) 100%)',
        'gradient-glow':  'radial-gradient(ellipse at center, rgba(79,156,249,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'sonic':   '0 0 24px rgba(79,156,249,0.25), 0 0 8px rgba(79,156,249,0.1)',
        'card':    '0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.04)',
        'elevated':'0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06)',
        'glow-sm': '0 0 12px rgba(79,156,249,0.3)',
        'inner':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      animation: {
        'fade-in':     'fadeIn 0.3s ease-out',
        'slide-up':    'slideUp 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-down':  'slideDown 0.4s cubic-bezier(0.16,1,0.3,1)',
        'scale-in':    'scaleIn 0.2s ease-out',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
        'shimmer':     'shimmer 1.5s ease-in-out infinite',
        'spin-slow':   'spin 8s linear infinite',
        'equalizer':   'equalizer 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:    { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown:  { from: { transform: 'translateY(-16px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        scaleIn:    { from: { transform: 'scale(0.95)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        pulseGlow:  { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        shimmer:    {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        equalizer: {
          '0%,100%': { height: '4px' },
          '50%': { height: '20px' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '68': '17rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      screens: {
        'xs': '480px',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
