/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
    './public/**/*.{html,js}',
    './application/**/*.{html,js}',
    './general/**/*.{html,js}',
    './Search/**/*.{html,js}',
    './shelter/**/*.{html,js}',
    '*.{html,js}'
],
  theme: {
    extend: {
      colors: {
        blue1: '#F7FFF7',
        blue2: '#ACE0E8',
        blue3: '#1A535C',
        blue4: '#226C77',
      }
    },
  },
  plugins: [],
}

