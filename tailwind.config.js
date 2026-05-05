/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: { DEFAULT: '#1A2FD4', dark: '#0D1A8A', mid: '#2B44E8', light: '#4B6EF5' },
        green: { DEFAULT: '#7EFFC5', light: '#B8FFE3', pale: '#E0FFF3' },
        dark: '#0a0a2e'
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif']
      }
    }
  },
  plugins: []
};