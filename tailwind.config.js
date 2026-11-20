/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./projects/demo-app/src/**/*.{html,ts}",
    "./projects/ui-lib/src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bangers', 'cursive'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};