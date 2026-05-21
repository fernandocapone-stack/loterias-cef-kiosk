/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // CAIXA — paleta institucional (Figma)
        primary: {
          DEFAULT: '#0066B3',
          dark: '#004F8B',
          darker: '#003666',
          mid: '#0058A0',
          light: '#1E7BC8',
        },
        accent: { DEFAULT: '#F39200', dark: '#C57600', light: '#FFB347' },
        success: '#0E8345',
        danger: '#C8102E',
        warning: '#F5A623',
        surface: '#F5F7FA',
        'surface-blue': '#EFF5F9', // bg das telas de conteúdo (Step 3/4 Figma)
        ink: '#101820',
        slate: '#4A5568',
        muted: '#6B7280',
        line: '#E2E8F0',
        lottery: {
          mega: '#1AA659',
          lotofacil: '#9F33B1',
          quina: '#2B4A8B',
          lotomania: '#F49B33',
          timemania: '#00A335',
          duplasena: '#A6305C',
          milionaria: '#3DAFE0',
          supersete: '#9BC53D',
          loteca: '#E53038',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Escala calibrada para canvas 1440×900 (landscape kiosk/totem).
        // Referência Figma: Body/Display styles do design system Caixa.
        'kiosk-xs':   ['clamp(11px, 1.25vw, 18px)',  '1.5'],  // 18px @1440 — concurso, labels
        'kiosk-sm':   ['clamp(13px, 1.39vw, 20px)',  '1.5'],  // 20px @1440 — Body/Small
        'kiosk-base': ['clamp(17px, 1.67vw, 24px)',  '1.35'], // 24px @1440 — tabs, badges
        'kiosk-lg':   ['clamp(22px, 2.22vw, 32px)',  '1.4'],  // 32px @1440 — H4 / card title
        'kiosk-xl':   ['clamp(26px, 2.5vw,  36px)',  '1.2'],  // 36px @1440 — section title
        'kiosk-2xl':  ['clamp(48px, 5.28vw, 76px)',  '1.15'], // 76px @1440 — Display/Medium
      },
      // Tailwind já possui rounded-lg = 8px e rounded-full = 9999px.
      // Esses são os únicos dois valores usados no projeto.
      boxShadow: {
        card: '0 2px 8px rgba(26, 21, 53, 0.04), 0 8px 24px rgba(26, 21, 53, 0.04)',
        'card-hover': '0 4px 16px rgba(26, 21, 53, 0.06), 0 16px 40px rgba(26, 21, 53, 0.08)',
        'card-strong': '0 12px 32px rgba(26, 21, 53, 0.10)',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 250ms ease-out',
        ripple: 'ripple 600ms linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: 0.5 },
          '100%': { transform: 'scale(4)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
