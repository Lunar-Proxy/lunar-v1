/** @type {import('tailwindcss').Config} */

module.exports = {
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
};
