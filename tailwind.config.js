// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        burgundy: {
          50: "#F5EBDC",
          100: "#E8D4C0",
          200: "#D4B89D",
          300: "#C4A57B",
          400: "#A88A60",
          500: "#8B4545",
          600: "#7A3939",
          700: "#5C2E2E",
          800: "#3D2424",
          900: "#281414",
        },
        beige: {
          50: "#FEFDFB",
          100: "#F5EBDC",
          200: "#EAD7C0",
          300: "#E0C9A9",
          400: "#D4B89D",
          500: "#C4A57B",
          600: "#B08F5E",
          700: "#8B6F47",
          800: "#6B5436",
          900: "#4A3921",
        },
      },
      fontFamily: {
        serif: ["Crimson Text", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
