import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F97316', 50: '#FFF7ED', 500: '#F97316', 600: '#EA580C' },
        accent: { DEFAULT: '#22C55E' },
        surface: { deep: '#000000', base: '#050506', card: '#121212', elevated: '#1A1A1A' },
        glass: {
          bg: 'rgba(255,255,255,0.05)',
          border: 'rgba(255,255,255,0.08)',
          'bg-medium': 'rgba(255,255,255,0.08)',
        },
        muted: { DEFAULT: '#8A8F98', foreground: '#6B7280' },
      },
      fontFamily: {
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        heading: ['Barlow Condensed', 'system-ui', 'sans-serif'],
      },
      borderRadius: { lg: '16px', md: '12px', sm: '8px' },
      backdropBlur: { glass: '12px' },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
