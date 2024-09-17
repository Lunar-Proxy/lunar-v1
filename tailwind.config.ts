/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        bgcolr: "#303446",
        link: "#89b4fa",
        head: "#c6d0f5",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".color-link": {
          color: "#89b4fa",
        },
        ".color-head": {
          color: "#c6d0f5",
        },
        ".color-ph::placeholder": {
          color: "#c6d0f5",
        },
      });
    },
  ],
};
