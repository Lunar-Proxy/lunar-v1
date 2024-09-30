import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import { IncomingMessage, ServerResponse, createServer, Server } from "http";
import { Socket } from "net";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

// wisp settings
// See readme for more details
//  wisp.options.dns_method = "resolve";
// wisp.options.dns_servers = ["1.1.1.3", "1.0.0.3"];
// wisp.options.dns_result_order = "ipv4first";

const execPromise = promisify(exec);
const port = 8080;

const serverFactory = (
  handler: (req: IncomingMessage, res: ServerResponse) => void,
): Server =>
  createServer(handler).on("upgrade", (req, socket: Socket, head) => {
    if (req.url?.startsWith("/w")) {
      wisp.routeRequest(req, socket, head);
    } else {
      socket.destroy();
    }
  });

const app: FastifyInstance = Fastify({
  logger: false, // Set to true to enable logging
  serverFactory,
});

try {
  if (!fs.existsSync("dist")) {
    console.log(chalk.blue.bold("Dist not found, building..."));
    await execPromise("npm run build");
    console.log(chalk.green.bold("Dist successfully built!"));
  }

  await app.register(fastifyMiddie);
  await app.register(fastifyCompress, {
    encodings: ["deflate", "gzip", "br"],
  });

  let Handler;
  if (fs.existsSync("./dist/server/entry.mjs")) {
    // @ts-ignore
    const module = await import("./dist/server/entry.mjs");
    Handler = module.handler;
    app.use(Handler);
  }

  await app.register(fastifyStatic, {
    root: fileURLToPath(new URL("./dist/client", import.meta.url)),
  });

  app.register(fastifyStatic, {
    root: epoxyPath,
    prefix: "/ep/",
    decorateReply: false,
  });

  app.register(fastifyStatic, {
    root: baremuxPath,
    prefix: "/bm/",
    decorateReply: false,
  });
  app.listen({ port }, (err, address) => {
    if (err) {
      console.error(chalk.red.bold(err));
      process.exit(1);
    } else {
      console.log(
        chalk.blue.bold(
          `Lunar v${process.env.npm_package_version} is running on:`,
        ),
      );
      console.log(chalk.blue.bold(`http://localhost:${port}`));
      console.log(chalk.blue.bold(`${address}`));
    }
  });
} catch (error) {
  console.error(
    chalk.red.bold("Error building or starting the server:"),
    error,
  );
}
