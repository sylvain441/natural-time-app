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
        'nt-yellow': {
          ultralight: '#FFFDD6',
          lighter: '#fff768',
          light: '#fff200',
          dark: '#ffd700',
          darker: '#ffc700',
        },
        'nt-cyan': {
          light: '#00F2FF',
          dark: '#00d7e6',
          darker: '#02B2B8',
        },
        'nt-magenta': {
          light: '#FF80CB',
          dark: '#de3252',
          darker: '#c02641',
        },
      },
      textDecorationThickness: {
        3: '3px',
        5: '5px',
        6: '6px',
      },
      scale: {
        200: '2',
      },
    },
  },
  plugins: [],
}

