/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        forest: {
          50:  '#f0f5ef',
          100: '#d6e8d3',
          200: '#afd1a9',
          300: '#7db575',
          400: '#52964a',
          500: '#2d6b27',
          600: '#1e5219',
          700: '#163d12',
          800: '#0f2a0c',
          900: '#081a07',
          950: '#040e04',
        },
        beige: {
          50:  '#faf7f0',
          100: '#f5f0e8',
          200: '#ede4d0',
          300: '#e0d3b5',
          400: '#d0bf97',
          500: '#bda87a',
          600: '#a08c5b',
          700: '#7d6c42',
          800: '#5a4d2e',
          900: '#382f1b',
        },
        primary: {
          50:  '#f0f5ef',
          100: '#d6e8d3',
          200: '#afd1a9',
          300: '#7db575',
          400: '#52964a',
          500: '#2d6b27',
          600: '#1e5219',
          700: '#163d12',
          800: '#0f2a0c',
          900: '#081a07',
        }
      }
    },
  },
  plugins: [],
}
