/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f0',
          100: '#fbe8e0',
          200: '#f6cfc1',
          300: '#eead97',
          400: '#e38263',
          500: '#d6603e',
          600: '#c84a2f',
          700: '#a73a27',
          800: '#8b3225',
          900: '#732d23',
        },
        secondary: {
          50: '#f5f5f4',
          100: '#e7e5e4',
          200: '#d6d3d1',
          300: '#a8a29e',
          400: '#78716c',
          500: '#57534e',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
