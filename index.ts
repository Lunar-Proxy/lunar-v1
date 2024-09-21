import Fastify from "fastify";
import fastifyMiddie from "@fastify/middie";
import fastifyStatic from "@fastify/static";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "child_process";
import { promisify } from "node:util";
import chalk from "chalk";

const execPromise = promisify(exec);
const port = 8080;

// Fastify config options
const app = Fastify({
  logger: false, // set to true to enable logs
});

if (!fs.existsSync("dist")) {
  try {
    console.log(chalk.blue.bold("Dist not found, building..."));
    await execPromise("npm run build");
    console.log(chalk.green.bold("Dist successfully built!"));
  } catch (e) {
    console.error(chalk.red.bold(e));
    process.exit(1);
  }
}

await app.register(fastifyMiddie);

await app.register(import("@fastify/compress"), {
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

app.listen({ port }, (err, address) => {
  if (err) {
    console.error(chalk.red.bold(err));
  } else {
    console.log(chalk.blue.bold("Lunar is running on:"));
    console.log(chalk.blue.bold(`http://localhost:${port}`));
    console.log(chalk.blue.bold(`${address}`));
  }
});
