import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import tailwind from "@astrojs/tailwind";

// wisp settings
// See readme for more details
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
