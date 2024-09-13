/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ['DM Serif Display', 'sans-serif'],
      },
      colors: {
        'ntyellow': {
          light: '#fff200',
          dark: '#ffd700',
        },
        'ntcyan': {
          light: '#00F2FF',
          dark: '#00d7e6',
        },
        'ntmagenta': {
          light: '#fe6c87',
          dark: '#de3252',
        },
      }
    },
  },
  plugins: [],
}

