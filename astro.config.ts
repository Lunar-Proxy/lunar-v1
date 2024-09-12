import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import tailwind from "@astrojs/tailwind";

import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  output: "hybrid",

  adapter: vercel(),

  integrations: [tailwind()],
});
