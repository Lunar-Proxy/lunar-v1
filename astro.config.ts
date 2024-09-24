import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import { viteStaticCopy } from "vite-plugin-static-copy";
import wisp from "wisp-server-node";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
// @ts-expect-error
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "hybrid",
  adapter: node({
    mode: "middleware",
  }),
  integrations: [tailwind()],
  vite: {
    plugins: [
      {
        name: "custom-w-server",
        configureServer(server) {
          server.httpServer?.on("upgrade", (req, socket, head) =>
            req.url?.startsWith("/w")
              ? wisp.routeRequest(req, socket, head)
              : null,
          );
        },
      },

      viteStaticCopy({
        targets: [
          {
            src: epoxyPath + "/**/*",
            dest: "ep",
          },
          {
            src: baremuxPath + "/**/*",
            dest: "bm",
          },
        ],
      }),
    ],
  },
});
