/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F97316', 50: '#FFF7ED', 100: '#FFEDD5', 500: '#F97316', 600: '#EA580C' },
        accent: { DEFAULT: '#22C55E' },
        surface: { deep: '#000000', base: '#050506', card: '#121212' },
        glass: { bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.08)' },
      },
      fontFamily: { sans: ['Barlow', 'System'], heading: ['BarlowCondensed', 'System'] },
    },
  },
  plugins: [],
};
