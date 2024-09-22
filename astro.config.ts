import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

export default defineConfig({
  output: "hybrid",
  adapter: node({
    mode: "middleware",
  }),

  integrations: [tailwind(), sentry(), spotlightjs()],
});
