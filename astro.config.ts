import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import tailwind from "@astrojs/tailwind";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { version } from "./package.json";
import { normalizePath } from "vite";
export default defineConfig({
  output: "hybrid",
  adapter: node({
    mode: "middleware",
  }),
  integrations: [tailwind()],

  vite: {
    define: {
      VERSION: JSON.stringify(version),
    },
    plugins: [
      {
        name: "viteserver",
        configureServer(server) {
          server.httpServer?.on("upgrade", (req, socket, head) => {
            if (req.url?.startsWith("/goo")) {
              wisp.routeRequest(req, socket, head);
            } else {
              null;
            }
          });
        },
      },
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(epoxyPath + "/**/*.mjs"),
            dest: "ep",
            overwrite: false,
          },
          {
            src: normalizePath(baremuxPath + "/**/*.js"),
            dest: "bm",
          },
          {
            src: normalizePath(libcurlPath + "/**/*.mjs"),
            dest: "lb",
          },
        ],
      }),
    ],
  },
});