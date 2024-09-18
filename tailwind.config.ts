/** @type {import('tailwindcss').Config} */
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
    function ({ addComponents, addUtilities }) {
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

      addUtilities(
        {
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
          ".tooltip": {
            position: "absolute",
            padding: "0.5rem",
            "border-radius": "0.25rem",
            "background-color": "#000",
            color: "#fff",
            "text-align": "center",
            "font-size": "0.875rem",
            opacity: "0",
            transition: "opacity 0.3s",
            "white-space": "nowrap",
            "z-index": "10",
          },
          ".group:hover .tooltip": {
            opacity: "1",
          },
        },
        ["responsive", "hover"],
      );
    },
  ],
};
