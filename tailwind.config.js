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
          darker: '#ffc700',
        },
        'ntcyan': {
          light: '#00F2FF',
          dark: '#00d7e6',
          darker: '#02B2B8',
        },
        'ntmagenta': {
          light: '#FF80CB',
          dark: '#de3252',
          darker: '#c02641',
        },
      }
    },
  },
  plugins: [],
}

