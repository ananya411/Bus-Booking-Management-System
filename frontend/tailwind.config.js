/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        'brand-dark': '#061D15',
        'brand-darker': '#011810',
        'brand-dark-card': '#0A261D',
        'brand-accent': '#6DCE05',
        'brand-accent-hover': '#5BB503',
        'brand-accent-light': '#9DEE09',
        'brand-gray': '#F5FAF6',
        'brand-border': '#14382B',
      },
      boxShadow: {
        'nav': '0 4px 20px -2px rgba(1, 24, 16, 0.45)',
        'dropdown': '0 10px 25px -5px rgba(1, 24, 16, 0.6), 0 8px 10px -6px rgba(1, 24, 16, 0.5)',
        'glow': '0 0 25px -5px rgba(109, 206, 5, 0.35)',
      },
    },
  },
  plugins: [],
};
