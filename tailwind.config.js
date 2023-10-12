/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./application/*.html",
            "./general/*.html",
            "./pet/*.html",
          "./application/conversation.html"],
  theme: {
    extend: {
      colors: {
        blue1: '#F7FFF7',
        blue2: '#ACE0E8',
        blue3: '#1A535C',
      }
    },
  },
  plugins: [],
}

