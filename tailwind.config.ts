/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{astro,html,js,md,ts,vue}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          overlay: "var(--background-overlay)",
        },
        text: {
          HEADER: "var(--text-header)",
        },
      },
    },
  },
};
