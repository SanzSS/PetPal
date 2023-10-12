/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './**/*.html',
    './*.css',
    './**/*.css',
  ],
  theme: {
    extend: {colors: {
      blue1: '#F7FFF7',
      blue2: '#ACE0E8',
      blue3: '#1A535C',
    }},
  },
  plugins: [],
}

