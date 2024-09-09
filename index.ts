import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fs from "node:fs";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import { promisify } from "node:util";
import chalk from "chalk";
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import wisp from 'wisp-server-node';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';

const execPromise = promisify(exec);
const port = "8080" as string;
const serverFactory = (handler: (req: IncomingMessage, res: ServerResponse) => void) => {
  return createServer()
    .on('request', (req: IncomingMessage, res: ServerResponse) => {
      handler(req, res); 
    })
    .on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
      if (req.url?.endsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head); 
      }
    });
};
// fastify config options
const app = Fastify({
  logger: false,
  serverFactory: serverFactory,
});

if (!fs.existsSync("dist")) {
  try {
    console.log(chalk.blue.bold("Dist not found, building..."));
    await execPromise("pnpm build");
    console.log(chalk.green.bold("Dist successfully built!"));
  } catch (e) {
    console.log(chalk.red.bold("Unable to build dist folder", e));
    process.exit(1);
  }
}

await app.register(fastifyMiddie);

let ssrHandler;
if (fs.existsSync("./dist/server/entry.mjs")) {
  const module = await import("./dist/server/entry.mjs");
  ssrHandler = module.handler;
  app.use(ssrHandler);
}

await app.register(fastifyStatic, {
  root: fileURLToPath(new URL("./dist/client", import.meta.url)),
});


app.register(fastifyStatic, {
  root: baremuxPath,
  prefix: '/b/',
  decorateReply: false,
});

app.register(fastifyStatic, {
  root: epoxyPath,
  prefix: '/e/',
  decorateReply: false,
});

app.listen(port, (err, address) => {
  if (err) {
    console.log(chalk.blue.bold("The following error happend", err));
  } else {
    console.log(chalk.blue.bold("Lunar is running on:"));
    console.log(chalk.blue.bold(`http://localhost:${port}`));
    console.log(chalk.blue.bold(`${address}`));
  }
});
