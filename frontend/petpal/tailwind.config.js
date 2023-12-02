/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {colors: {
      blue1: '#F7FFF7',
      blue2: '#ACE0E8',
      blue3: '#1A535C',
      blue4: '#226C77',
    }},
  },
  plugins: [],
}