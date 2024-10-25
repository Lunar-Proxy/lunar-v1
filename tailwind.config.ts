/** @type {import('tailwindcss').Config} */

export default {
  content: ["./src/**/*.{astro,html,js,md,ts,vue}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
        },
        text: {
          DEFAULT: "var(--text)",
        },
      },
    },
  },
  plugins: [],
};
