/** @type {import('tailwindcss').Config} */
export default {
  // `dark:` classes follow the theme toggle (class on <body>), not the OS setting
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
