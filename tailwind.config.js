/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#faf8f5",
          100: "#f5f1ea",
          200: "#e8dfd0",
          300: "#d6c7b0",
          400: "#c4ad8f",
          500: "#b39376",
          600: "#8b6f54",
          700: "#6d5743",
          800: "#4a3a2e",
          900: "#2d251f",
        },
        accent: {
          50: "#fdf4f5",
          100: "#fbe8eb",
          200: "#f6d0d7",
          300: "#eeadb9",
          400: "#e38194",
          500: "#d4566f",
          600: "#b83d56",
          700: "#8b2e40",
          800: "#6b2432",
          900: "#4a1a23",
        },
      },
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
        display: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
