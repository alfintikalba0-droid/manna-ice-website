/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // "black" is remapped to the brand navy so every dark surface/text/border picks it up.
        black: '#0B1B45',
        navy: '#0B1B45',
        royal: '#1F3FB0',
        ice: '#D6ECFB',
        frost: '#F4F9FE',
        accent: '#3FD0F2',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['Unbounded', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
