import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fastifyCompress from "@fastify/compress";
import { promises as fs } from "node:fs";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import { IncomingMessage, ServerResponse, createServer, Server } from "http";
import { Socket } from "net";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execPromise = promisify(exec);
const port: number = Number(process.env.PORT) || 8080;

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

const app = Fastify({
  logger: false,
  serverFactory,
});

if (
  !(await fs
    .stat("dist")
    .then(() => true)
    .catch(() => false))
) {
  console.log(chalk.blue.bold("Dist not found, building..."));
  await execPromise("npm run build");
  console.log(chalk.green.bold("Dist successfully built!"));
}

await app.register(fastifyMiddie);
await app.register(fastifyCompress, {
  encodings: ["deflate", "gzip", "br"],
});

let Handler;
if (
  await fs
    .stat("./dist/server/entry.mjs")
    .then(() => true)
    .catch(() => false)
) {
  const module = await import("./dist/server/entry.mjs");
  Handler = module.handler;
  app.use(Handler);
}

await app.register(fastifyStatic, {
  root: `${__dirname}/dist/client`,
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
