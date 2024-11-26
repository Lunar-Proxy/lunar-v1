import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import chalk from "chalk";
import { createServer } from "http";
import { Socket } from "net";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const port: number = Number(process.env.PORT) || 8080;
const host: string = process.env.HOST || "localhost";

const build = async () => {
  if (!fs.existsSync("dist")) {
    console.log(
      chalk.yellow.bold("🚧 Cannot find dist folder, building lunar..."),
    );
    try {
      const Process = exec("npm run build");
      Process.stdout?.on("data", (data) => {
        process.stdout.write(chalk.cyan(data));
      });
      Process.stderr?.on("data", (data) => {
        process.stderr.write(chalk.red(data));
      });
      await new Promise((resolve, reject) => {
        Process.on("close", (code) => {
          if (code === 0) {
            resolve(true);
          } else {
            reject(
              new Error(
                `⚠️ Lunar failed to build failed with exit code ${code}`,
              ),
            );
          }
        });
      });
      console.log(chalk.green.bold("✅ Dist folder was successfully built."));
    } catch (error) {
      throw new Error(
        `${chalk.red.bold("❌ Failed to build the dist folder:")} ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }
};

const app = Fastify({
  logger: false,
  serverFactory: (handler) =>
    createServer(handler).on("upgrade", (req, socket: Socket, head) => {
      if (req.url?.startsWith("/w")) {
        wisp.routeRequest(req, socket, head);
      } else {
        socket.destroy();
      }
    }),
});

try {
  await build();
  await app.register(fastifyMiddie);
  await app.register(fastifyCompress, { encodings: ["deflate", "gzip", "br"] });

  if (fs.existsSync("./dist/server/entry.mjs")) {
    //@ts-ignore
    const module = await import("./dist/server/entry.mjs");
    app.use(module.handler);
  }

  app.register(fastifyStatic, {
    root: fileURLToPath(new URL("./dist/client", import.meta.url)),
  });
  app.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/ep/",
    decorateReply: false,
  });
  app.register(fastifyStatic, {
    root: libcurlPath,
    prefix: "/lb/",
    decorateReply: false,
  });
  app.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/bm/",
    decorateReply: false,
  });

  app.listen({ host, port }, (err, address) => {
    if (err) {
      console.error(chalk.red.bold(`❌ Failed to start lunar: ${err.message}`));
      process.exit(1);
    } else {
      console.log(
        chalk.green.bold(
          `🌙 Lunar v${process.env.npm_package_version} is running on:`,
        ),
      );
      console.log(chalk.blue(`🌐 Local: http://${host}:${port}`));
      console.log(chalk.blue(`🌍 Network: ${address}`));
    }

    // https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    function shutdown() {
      console.log("SIGTERM signal received: closing HTTP server");
      app.server.close(() => {
        process.exit(0);
      });
    }
  });
} catch (error: unknown) {
  throw new Error(
    `${chalk.red.bold("An error happend while trying to start lunar:")} ${
      error instanceof Error ? error.message : error
    }`,
  );
}
