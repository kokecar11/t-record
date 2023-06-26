/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors:{
        'primary': '#0E0E0E',
        'secondary': '#9747FF',
        'accent': '#262626',
        'offline': '#D9D9D9',
        'live': '#EF233C',
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      border: ['disabled'],
    }
  },
  plugins: [],
};
