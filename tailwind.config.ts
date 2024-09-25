/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{astro,html,js,md,ts,vue}"],
  theme: {
    extend: {
      colors: {
        bgcolr: "#303446",
        link: "#89b4fa",
        head: "#c6d0f5",
      },
      textShadow: {
        bubble:
          "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
      },
    },
  },
  plugins: [
    plugin(function ({
      addComponents,
      addUtilities,
    }: import("tailwindcss/types/config").PluginAPI) {
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
        ".custom-input": {
          height: "58px",
          width: "488px",
        },
      });
      addUtilities({
        ".text-shadow-bubble": {
          "text-shadow":
            "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
        },
        ".text-shadow-bubble-blur": {
          position: "relative",
          display: "inline-block",
        },
        ".text-shadow-bubble-blur::before": {
          content: '""',
          position: "absolute",
          top: "2px",
          left: "2px",
          "z-index": "-1",
          color: "#fff",
          filter: "blur(2px)",
        },
        ".group:hover .tooltip": {
          opacity: "1",
        },
      });
    }),
  ],
};
