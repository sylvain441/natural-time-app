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
          darkest: '#cc9900',
        },
        'nt-cyan': {
          ultralight: '#DCFFFF',
          lighter: '#9EFCFF',
          light: '#00F2FF',
          dark: '#00d7e6',
          darker: '#00b5c2',
          darkest: '#016b6e',
        },
        'nt-magenta': {
          light: '#FF80CB',
          dark: '#de3252',
          darker: '#c02641',
          darkest: '#801728',
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
      spacing: {
        '1/7': '14.285714285714286%',
      },
      width: {
        'one-seventh': '14.285714285714286%',
        '112': '28rem',
        '120': '30rem',
        '240': '60rem',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      },
      blur: {
        xs: '1px',
      },
    },
  },
  plugins: [],
}

