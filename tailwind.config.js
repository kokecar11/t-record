/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      border: ['disabled'],
    }
  },
  plugins: [],
};
