/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#10b981',
        background: '#0f172a',
        surface: 'rgba(30, 41, 59, 0.7)',
        danger: '#ef4444'
      }
    },
  },
  plugins: [],
}
