/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors:{
        'primary': '#0E0E0E',
        'secondary': '#9747FF',
        'accent': '#18181C',
        'offline': '#D9D9D9',
        'live': '#EF233C',
        'back': '#121212'
      },
       fontSize: {
        'fluid-lg': 'clamp(2rem, calc(1.15rem + 1.50vw), 2.50rem)',
        'fluid-base': 'clamp(2rem, 8vw, 4rem)',
        'fluid-sm': 'clamp(0.7rem, 1.5vw, 1rem)',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      border: ['disabled'],
    }
  },
  plugins: [require('tailwindcss-animated')],
};
