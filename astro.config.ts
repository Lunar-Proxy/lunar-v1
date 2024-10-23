import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import tailwind from "@astrojs/tailwind";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { execSync } from "child_process";
import { version } from "./package.json";
import { normalizePath } from "vite";

// wisp settings
// See https://github.com/lunar-proxy/lunar/wiki for more details
//  wisp.options.dns_method = "resolve";
// wisp.options.dns_servers = ["1.1.1.3", "1.0.0.3"];
// wisp.options.dns_result_order = "ipv4first";

export default defineConfig({
  output: "hybrid",
  adapter: node({
    mode: "middleware",
  }),
  integrations: [tailwind()],
  vite: {
    define: {
      LAST_UPDATED: JSON.stringify(
        execSync("git log -1 --format=%cd").toString().trim(),
      ),
      VERSION: JSON.stringify(version),
    },
    plugins: [
      {
        name: "vite-ws-server",
        configureServer(server) {
          server.httpServer?.on("upgrade", (req, socket, head) => {
            if (req.url?.startsWith("/ws")) {
              wisp.routeRequest(req, socket, head);
            } else {
              return;
            }
          });
        },
      },
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(epoxyPath + "/**/*"),
            dest: "ep",
          },
          {
            src: normalizePath(baremuxPath + "/**/*"),
            dest: "bm",
          },
          {
            src: normalizePath(libcurlPath + "/**/*"),
            dest: "lc",
          },
        ],
      }),
    ],
  },
});
