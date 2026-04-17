/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Fonts ─────────────────────────────────────────────
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },

      // ── Brand Colours ─────────────────────────────────────
      colors: {
        // Primary hotel dark (deep navy)
        hotel: {
          dark:    '#0A2F3C',
          surface: '#F4F7F9',
          muted:   '#6B8B99',
          card:    '#FFFFFF',
        },

        // Gold palette
        gold: {
          50:  '#FDF8E7',
          100: '#FAF0C4',
          200: '#F5E18A',
          300: '#EFD160',
          400: '#D4AF37',
          500: '#BF9B2F',
          600: '#A08020',
          700: '#806515',
          800: '#604B0C',
          900: '#403206',
        },

        // Extended sky/teal palette
        sky: {
          50:  '#EFF8FC',
          100: '#D9EFF7',
          200: '#B3DFF0',
          300: '#8DCFE8',
          400: '#5BBFD9',
          500: '#3AAAC6',
          600: '#2A8FAD',
          700: '#1E7494',
          800: '#145A7A',
          900: '#0A3F60',
        },
      },

      // ── Background Gradients ───────────────────────────────
      backgroundImage: {
        'gold-gradient':    'linear-gradient(135deg, #D4AF37 0%, #E8C55A 50%, #D4AF37 100%)',
        'dark-gradient':    'linear-gradient(135deg, #0A2F3C 0%, #144F60 60%, #1F6E84 100%)',
        'hero-gradient':    'linear-gradient(to bottom, rgba(10,47,60,0.30) 0%, rgba(10,47,60,0.55) 50%, rgba(10,47,60,0.85) 100%)',
        'section-gradient': 'linear-gradient(135deg, #EFF8FC 0%, #F4F7F9 50%, #EFF8FC 100%)',
        'gold-shine':       'linear-gradient(105deg, #D4AF37 0%, #F5E18A 45%, #D4AF37 100%)',
      },

      // ── Box Shadows ────────────────────────────────────────
      boxShadow: {
        'card':        '0 4px 24px rgba(10,47,60,0.08)',
        'card-hover':  '0 12px 40px rgba(10,47,60,0.16)',
        'gold':        '0 6px 24px rgba(212,175,55,0.35)',
        'gold-hover':  '0 10px 32px rgba(212,175,55,0.50)',
        'sky':         '0 6px 20px rgba(91,191,217,0.35)',
        'sky-hover':   '0 10px 30px rgba(91,191,217,0.50)',
        'deep':        '0 20px 60px rgba(10,47,60,0.25)',
        'glass':       '0 8px 32px rgba(10,47,60,0.12), inset 0 1px 0 rgba(255,255,255,0.15)',
      },

      // ── Border Radius ──────────────────────────────────────
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ── Animation ─────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(212,175,55,0)' },
        },
      },
      animation: {
        shimmer:      'shimmer 2.5s linear infinite',
        float:        'float 4s ease-in-out infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
      },

      // ── Transition Duration ────────────────────────────────
      transitionDuration: {
        '400': '400ms',
      },

      // ── Scale ─────────────────────────────────────────────
      scale: {
        '107': '1.07',
      },

      // ── Spacing extras ─────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '96': '24rem',
        '128': '32rem',
      },

      // ── Typography ─────────────────────────────────────────
      letterSpacing: {
        'widest': '0.22em',
        'ultra':  '0.30em',
      },
    },
  },
  plugins: [],
}
